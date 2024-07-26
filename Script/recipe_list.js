// recipe_list.js

// 예시 데이터 (배열 형태로 변경)
const recipes = [
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "김치찌개",
        cooking_method: "찌개",
        meal_category: "일상",
        ingredient_category: "육류",
        dish_type: "메인",
        description: "한국의 대표적인 찌개 요리, 김치찌개입니다.",
        ingredients:
            "[재료] 김치 1/2포기| 돼지고기 200g| 두부 1/2모| 양파 1개| 대파 1대| 고춧가루| 다진마늘",
        recipe_amount: "4인분",
        recipe_time: "40분",
        instructions:
            "1. 돼지고기를 적당한 크기로 자르고 양파를 채썰어 준비합니다. 2. 김치를 잘게 썰어냅니다. 3. 냄비에 돼지고기를 넣고 볶다가 김치를 넣고 함께 볶아줍니다. 4. 물을 붓고 끓이면서 두부와 양파를 넣습니다. 5. 고춧가루와 다진마늘로 간을 맞추고 대파를 넣고 한소끔 끓입니다.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2016/06/09/kimchi_stew.jpg",
        recipe_difficulty: "중급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
    {
        recipe_name: "두부새우전",
        cooking_method: "부침",
        meal_category: "일상",
        ingredient_category: "해물류",
        dish_type: "밑반찬",
        description:
            "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
        ingredients:
            "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
        recipe_amount: "3인분",
        recipe_time: "30분이내",
        instructions:
            "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
        photo_url:
            "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
        recipe_difficulty: "초급",
        icon_url: "detail-people.png",
        icon_url2: "detail-clock.png",
        icon_url3: "detail-star.png",
    },
];

// 레시피 리스트를 렌더링하는 함수
function renderRecipes() {
    const recipeList = document.getElementById("recipe-list");
    recipes.forEach((recipe) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <img src="${recipe.photo_url}" alt="${recipe.recipe_name}">
            <div class="recipe-details">
                <h2>${recipe.recipe_name}</h2>
                <p>${recipe.description}</p>
                <div class="recipe-meta">
                    <span><img src="${recipe.icon_url}" class="icon" alt="people icon"> ${recipe.recipe_amount}</span>
                    <span><img src="${recipe.icon_url2}" class="icon" alt="clock icon"> ${recipe.recipe_time}</span>
                    <span><img src="${recipe.icon_url3}" class="icon" alt="star icon"> ${recipe.recipe_difficulty}</span>
                </div>
            </div>
        `;

        recipeList.appendChild(recipeDiv);
    });
}

// DOM이 완전히 로드된 후에 레시피 렌더링
document.addEventListener("DOMContentLoaded", (event) => {
    renderRecipes();
});
