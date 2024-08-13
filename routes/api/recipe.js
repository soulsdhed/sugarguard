const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../../conf/db");
const authenticateToken = require("../../middlewares/authenticateToken");
const { isValidURL } = require("../../utils/validation");
require("dotenv").config();

// 레시피 추천 (jwt - 회원)
router.get("/", authenticateToken, async (req, res, next) => {
  let {
    have,
    prefer,
    dislike,
    amount,
    time,
    difficult,
    photo_url,
    count = 10,
  } = req.query;

  // console.log(req.query);

  // 내용물이 공백으로 오면 undefined한다 (제외 처리)
  if (!have) {
    have = undefined;
  }
  if (!prefer) {
    prefer = undefined;
  }
  if (!dislike) {
    dislike = undefined;
  }
  if (!amount) {
    amount = undefined;
  }
  if (!time) {
    time = undefined;
  }
  if (!difficult) {
    difficult = undefined;
  }
  if (!photo_url) {
    photo_url = undefined;
  }

  // photo_url 검사 (key 형태로 넘어오면 url을 재조립해준다)
  // console.log("photo_url : ", photo_url);

  // photo_url이 존재하면 flask 서버로 사진을 보내 확인한다
  if (photo_url) {
    // key인지 url인지 구분한다
    if (!isValidURL(photo_url)) {
      photo_url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${photo_url}`;
    }
    // console.log("photo_url", photo_url);

    // Flask 서버로 사진을 보내서, have 추출
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ingredients-detection",
        {
          image_url: photo_url,
        }
      );
      // console.log("response", response);
      // console.log("have", response.data.ingredients_names);

      // have를 사진에서 추출 (have가 있는 경우와 없는 경우로 분리)
      if (!have) {
        have = response.data.ingredients_names;
      } else {
        have += `, ${response.data.ingredients_names}`;
      }
    } catch (e) {
      console.log(e);
      return next({
        code: "SERVER_SERVICE_UNAVAILABLE",
      });
    }
  }

  // max count : 10
  count = Math.min(parseInt(count), 10);

  // 재료를 ,를 기준으로 분리 (공백 제거)
  const haveIngredients = have
    ? have.split(",").map((item) => item.trim())
    : [];
  const preferIngredients = prefer
    ? prefer.split(",").map((item) => item.trim())
    : [];
  const dislikeIngredients = dislike
    ? dislike.split(",").map((item) => item.trim())
    : [];

  // 가지고 있는 재료가 없는 경우 (왜 요청해...?)
  // if (haveIngredients.length < 1) {
  //     return next({
  //         code: "VALIDATION_MISSING_FIELD",
  //     });
  // }

  // 재료 query string
  const haveWeight = 1;
  const preferWeight = 0.3;
  const dislikeWeight = -0.5;
  let ingredientsQueryString = "";
  let orderByQueryString = "ORDER BY score DESC, RAND()";

  if (haveIngredients.length > 0) {
    for (let i = 0; i < haveIngredients.length; i++) {
      if (i > 0) {
        ingredientsQueryString += " + ";
      }
      ingredientsQueryString += `(ingredients LIKE '%${haveIngredients[i]}%') * ${haveWeight}`;
    }
  }
  if (preferIngredients.length > 0) {
    for (let i = 0; i < preferIngredients.length; i++) {
      ingredientsQueryString += ` + (ingredients LIKE '%${preferIngredients[i]}%') * ${preferWeight}`;
    }
  }
  if (dislikeIngredients.length > 0) {
    for (let i = 0; i < dislikeIngredients.length; i++) {
      ingredientsQueryString += ` + (ingredients LIKE '%${dislikeIngredients[i]}%') * ${dislikeWeight}`;
    }
  }

  if (ingredientsQueryString != "") {
    ingredientsQueryString = `,
        (
            ${ingredientsQueryString}
            ) AS score`;
  } else {
    orderByQueryString = "ORDER BY RAND()";
  }
  // console.log("ingredientsQueryString", ingredientsQueryString);

  // 추가 정보
  const updates = [];
  const params = [];

  // 요리 인원수 : 1인분, 2인분, 3인분, 4인분, 5인분, 6인분이상
  // 요라양
  if (amount) {
    // 요라양을 ,를 기준으로 분리
    amount = amount.replace("4인분이상", "4인분, 5인분, 6인분이상");
    // console.log("amount", amount);
    const amountList = amount
      ? amount.split(",").map((item) => item.trim())
      : [];

    // 요라양이 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (amountList.length == 1) {
      updates.push("recipe_amount = ?");
      params.push(amountList[0]);
    } else if (amountList.length > 1) {
      updates.push(
        `recipe_amount IN (${amountList.map(() => "?").join(", ")})`
      );
      params.push(...amountList);
    }
  }

  // 요리 시간 : 5분이내, 10분이내, 15분이내, 20분이내, 30분이내, 60분이내, 90분이내, 2시간이내, 2시간이상
  // 시간
  if (time) {
    // 시간을 ,를 기준으로 분리
    time = time.replace("15분이내", "5분이내, 10분이내, 15분이내");
    time = time.replace("30분이내", "20분이내, 30분이내");
    const timeList = time ? time.split(",").map((item) => item.trim()) : [];

    // 시간이 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (timeList.length == 1) {
      updates.push("recipe_time = ?");
      params.push(timeList[0]);
    } else if (timeList.length > 1) {
      updates.push(`recipe_time IN (${timeList.map(() => "?").join(", ")})`);
      params.push(...timeList);
    }
  }

  // 난이도 : 아무나, 초급, 중급, 고급, 신의경지
  // 난이도
  if (difficult) {
    // 난이도를 ,를 기준으로 분리
    difficult = difficult.replace("고급", "고급, 신의경지");
    const difficultList = difficult
      ? difficult.split(",").map((item) => item.trim())
      : [];

    // 시간이 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (difficultList.length == 1) {
      updates.push("recipe_difficult = ?");
      params.push(difficultList[0]);
    } else if (difficultList.length > 1) {
      updates.push(
        `recipe_difficult IN (${difficultList.map(() => "?").join(", ")})`
      );
      params.push(...difficultList);
    }
  }
  // console.log(params);

  // 기본 WHERE 절
  let whereClause = "approved = TRUE";
  // 조건이 있는 경우 추가
  if (updates.length > 0) {
    whereClause += " AND " + updates.join(" AND ");
  }

  // console.log(params);
  // query
  const query = `
        SELECT 
            recipe_id,
            recipe_name, 
            cooking_method,
            meal_category,
            ingredient_category,
            dish_type,
            instructions,
            ingredients,
            description,
            photo_url,
            recipe_amount,
            recipe_time,
            recipe_difficult
            ${ingredientsQueryString}
        FROM  RECIPE_TB
        WHERE ${whereClause}
        ${orderByQueryString}
        LIMIT ${count};`;

  db.execute(query, params, (err, rows) => {
    if (err) {
      console.log(err);
      return next({
        code: "SERVER_INTERNAL_ERROR",
      });
    }

    return res.success({
      count: rows.length,
      recipes: rows,
    });
  });
});

// 레시피 추천 (비회원)
router.get("/recommend", (req, res, next) => {
  const { have } = req.query;

  // 재료를 ,를 기준으로 분리 (공백 제거)
  const haveIngredients = have
    ? have.split(",").map((item) => item.trim())
    : [];

  // 가지고 있는 재료가 없는 경우 (왜 요청해...?)
  if (haveIngredients.length < 1) {
    return next({
      code: "VALIDATION_MISSING_FIELD",
    });
  }

  // 재료 query string
  const haveWeight = 1;
  let ingredientsQueryString = "";

  if (haveIngredients.length > 0) {
    for (let i = 0; i < haveIngredients.length; i++) {
      if (i > 0) {
        ingredientsQueryString += " + ";
      }
      ingredientsQueryString += `(ingredients LIKE '%${haveIngredients[i]}%') * ${haveWeight}`;
    }
  }
  // console.log(ingredientsQueryString);

  // query
  const query = `
        SELECT 
            recipe_id,
            recipe_name, 
            cooking_method,
            meal_category,
            ingredient_category,
            dish_type,
            instructions,
            ingredients,
            description,
            photo_url,
            recipe_amount,
            recipe_time,
            recipe_difficult,
            (
                ${ingredientsQueryString}
            ) AS score
        FROM RECIPE_TB
        WHERE approved = TRUE
        ORDER BY score DESC, RAND()
        LIMIT 10;`;

  // console.log(query);

  db.execute(query, [], (err, rows) => {
    if (err) {
      return next({
        code: "SERVER_INTERNAL_ERROR",
      });
    }

    return res.success({
      count: rows.length,
      recipes: rows,
    });
  });
});

// 레시피 등록
router.post("/", authenticateToken, (req, res, next) => {
  // 요리 인원수 : 1인분, 2인분, 3인분, 4인분, 5인분, 6인분이상
  // 요리 시간 : 5분이내, 10분이내, 15분이내, 20분이내, 30분이내, 60분이내, 90분이내, 2시간이내, 2시간이상
  // 난이도 : 아무나, 초급, 중급, 고급, 신의경지

  const { userId } = req.user;
  const {
    recipe_name,
    cooking_method,
    meal_category,
    ingredient_category,
    dish_type,
    instructions,
    ingredients,
    description,
    photo_url = "",
    recipe_amount = "1인분",
    recipe_time = "30분이내",
    recipe_difficult = "아무나",
  } = req.body;

  // userId
  if (
    !userId ||
    !recipe_name ||
    !cooking_method ||
    !meal_category ||
    !ingredient_category ||
    !dish_type ||
    !instructions ||
    !ingredients ||
    !description ||
    !photo_url ||
    !recipe_amount ||
    !recipe_time ||
    !recipe_difficult
  ) {
    return next({
      code: "VALIDATION_MISSING_FIELD",
    });
  }

  // TODO : S3 업로드 고려해서 url을 만들기 (url 형식이면 안하고 url 형식이 아니면 하도록?)
  // const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${photo_url}`;

  // recipe 정보
  const query = `
        INSERT INTO MEMBER_TB (
            recipe_name, 
            cooking_method, 
            meal_category, 
            ingredient_category, 
            dish_type, 
            instructions, 
            ingredients,
            description,
            photo_url,
            recipe_amount,
            recipe_time,
            recipe_difficult,
            member_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  db.execute(
    query,
    [
      recipe_name,
      cooking_method,
      meal_category,
      ingredient_category,
      dish_type,
      instructions,
      ingredients,
      description,
      photo_url,
      recipe_amount,
      recipe_time,
      recipe_difficult,
      userId,
    ],
    (err, results) => {
      if (err) {
        return next({
          code: "SERVER_INTERNAL_ERROR",
        });
      }

      // 레시피 등록 성공
      return res.success({
        userId: userId,
        recipe: {
          recipe_name: recipe_name,
          cooking_method: cooking_method,
          meal_category: meal_category,
          ingredient_category: ingredient_category,
          dish_type: dish_type,
          instructions: instructions,
          ingredients: ingredients,
          description: description,
          photo_url: photo_url,
          recipe_amount: recipe_amount,
          recipe_time: recipe_time,
          recipe_difficult: recipe_difficult,
        },
      });
    }
  );
});

// 레시피 조회
router.get("/:recipe_id", (req, res, next) => {
  const { recipe_id } = req.params;

  const query = `
        SELECT 
            recipe_name, 
            cooking_method,
            meal_category,
            ingredient_category,
            dish_type,
            instructions,
            ingredients,
            description,
            photo_url,
            recipe_amount,
            recipe_time,
            recipe_difficult
        FROM RECIPE_TB
        WHERE recipe_id = ?
    `;
  db.execute(query, [recipe_id], (err, rows) => {
    if (err) {
      return next({
        code: "SERVER_INTERNAL_ERROR",
      });
    }

    return res.success({
      recipes: rows[0],
    });
  });
});

// 레시피 승인
router.patch("/", authenticateToken, (req, res, next) => {
  const { userId } = req.user;
  const { recipe_id } = req.body;

  // admin 확인
  if (userId !== "administrator") {
    return next({
      code: "AUTH_UNAUTHORIZED",
    });
  }

  // update
  const query = `UPDATE RECIPE_TB SET approved = TRUE WHERE recipe_id = ?`;
  db.execute(query, [recipe_id], (err, results) => {
    if (err) {
      return next({
        code: "SERVER_INTERNAL_ERROR",
      });
    }

    // 존재하지 않는 레시피
    if (results.affectedRows <= 0) {
      return next({
        code: "DATA_NOT_FOUND",
      });
    }

    return res.success({
      userId: userId,
      recipe_id: recipe_id,
    });
  });
});

module.exports = router;
