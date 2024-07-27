// recipe_list.js

// 예시 데이터 (배열 형태로 변경)
// const recipes = [
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficuly: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
//     {
//         recipe_name: "두부새우전",
//         cooking_method: "부침",
//         meal_category: "일상",
//         ingredient_category: "해물류",
//         dish_type: "밑반찬",
//         description:
//             "꼬리가 너-무- 매력적인 두부새우전. 두부와 야채를 한번에!! 영양까지 만점인 두부새우전. 모양도 이쁘고 맛까지 좋은 두부새우전!! 함께 만들어 보아요♥",
//         ingredients:
//             "[재료] 두부 1/2모| 당근 1/2개| 고추 2개| 브로콜리 1/4개| 새우 4마리| 녹말가루| 계란 1개",
//         recipe_amount: "3인분",
//         recipe_time: "30분이내",
//         instructions:
//             "1. 당근, 브로콜리, 고추를 잘게 다져주세요. 2. 두부를 칼등으로 으깨주세요. 3. 그 다음 거즈를 이용해 으깬 두부의 물기를 쪼-옥 빼주세요. 4. 으깬 두부와 다져 놓은 야채를 넣고 주물럭 주물럭 잘 섞어주세요. 이때 소금간을 조금 해주세요. 5. 새우는 머리를 제거하고 이쑤시개로 내장을 제거 한 후에 반으로 갈라서 준비해주세요. 6. 새우를 녹말가루에 묻힌 다음 톡톡톡 털어주세요. 7. 녹말가루를 묻힌 새우를 계란물에 퐁당 담가주세요. 8. 새우를 두부사이에 넣고 토닥토닥 하면서 모양을 만들어 주세요. 9. 모양을 만든 두부새우에 녹말가루를 한번 더 묻혀주세요. 10. 달군 팬에 기름을 두른 후 두부새우에 계란물을 묻혀 노릇노릇 지져주세요. 11. 노릇노릇 지져낸 두부새우전을 키친타올에 올려 불필요한 기름을 빼주세요.",
//         photo_url:
//             "https://recipe1.ezmember.co.kr/cache/recipe/2015/06/09/8d7a003794ac7ab77e5777796d9c20dd.jpg",
//         recipe_difficult: "초급",
//         icon_url: "detail-people.png",
//         icon_url2: "detail-clock.png",
//         icon_url3: "detail-star.png",
//     },
// ];

const icon_url = "detail-people.png";
const icon_url2 = "detail-clock.png";
const icon_url3 = "detail-star.png";

// 레시피 리스트를 렌더링하는 함수
function renderRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipes.forEach((recipe) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <a href="/recipe-details?recipe_id=${recipe.recipe_id}">
            <div class="recipe-details-wrapper">
                <img src="${recipe.photo_url}" alt="${recipe.recipe_name}">
                <div class="recipe-details">
                    <h2>${recipe.recipe_name}</h2>
                    <p>${recipe.description}</p>
                    <div class="recipe-meta">
                        <span><img src="${icon_url}" class="recipe-list-icon" alt="people icon"> ${recipe.recipe_amount}</span>
                        <span><img src="${icon_url2}" class="recipe-list-icon" alt="clock icon"> ${recipe.recipe_time}</span>
                        <span><img src="${icon_url3}" class="recipe-list-icon" alt="star icon"> ${recipe.recipe_difficult}</span>
                    </div>
                </div>
            </div>
            </a>
        `;

        recipeList.appendChild(recipeDiv);
    });
}

// DOM이 완전히 로드된 후에 레시피 렌더링
document.addEventListener("DOMContentLoaded", async (event) => {
    // 쿼리 스트링 분리
    const urlParams = new URLSearchParams(window.location.search);
    // 쿼리 스트링을 객체로 변환
    const params = {};
    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    // 넌적스 템플릿으로부터 userId 가져오기 (로그인 여부 확인)
    const userId = window.userIdFromTemplate;

    // 회원 비회원 구분
    if (userId == "" || userId === null || userId === undefined) {
        // 비회원
        // 레시피 api를 통해서 레시피 받아오기
        const response = await axios.get("/api/recipes/recommend", {
            params: {
                have: params.have,
            }
        })
        console.log(response.data.data.recipes);

        renderRecipes(response.data.data.recipes);
    } else {
        // 회원

    }

    // 뒤로 가기 버튼
    document.getElementById("recipe-list-goback").addEventListener("click", (e) => {
        history.back();
    })

    // 로딩화면 제거
    document.getElementById('loading-screen').style.display = 'none';
});
