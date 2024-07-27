document.addEventListener("DOMContentLoaded", async function () {
    let recipe = {
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
        recipe_difficult: "초급",
    };

    // 쿼리 스트링 분리
    const urlParams = new URLSearchParams(window.location.search);
    // 쿼리 스트링을 객체로 변환
    const params = {};
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    console.log(params.recipe_id);

    // 레시피 상세 정보 가져오기
    try {
        const response = await axios.get(`/api/recipes/${params.recipe_id}`);
        console.log(response.data.data.recipes);
        recipe = response.data.data.recipes;
    } catch (e) {
        console.log(e);
    }

    // 제목 설정
    document.getElementById("recipe_name").innerText = recipe.recipe_name;

    // 이미지 설정
    const photo = document.getElementById("photo");
    photo.src = recipe.photo_url;
    photo.alt = recipe.recipe_name;

    // 설명 설정
    document.getElementById("instruction").innerText = recipe.instructions;

    // 요리 기타 정보
    document.querySelectorAll(".recipe-detail-rowflex-div div")[0].innerText = recipe.recipe_amount;
    document.querySelectorAll(".recipe-detail-rowflex-div div")[1].innerText = recipe.recipe_time;
    document.querySelectorAll(".recipe-detail-rowflex-div div")[2].innerText = recipe.recipe_difficult;

    // 재료 제목과 테이블 설정
    const sections = recipe.ingredients.split('[').filter(Boolean).map(section => section.trim());
    const contentDiv = document.getElementById('ingredient-wrapper');

    // sections.forEach(section => {
    //     const [title, ...items] = section.split(']');
    //     const titleDiv = document.createElement('div');
    //     titleDiv.textContent = title;
    //     contentDiv.appendChild(titleDiv);

    //     const table = document.createElement('table');

    //     items.join(' ').split('|').forEach(item => {
    //         const row = document.createElement('tr');

    //         const lastSpaceIndex = item.lastIndexOf(' ');
    //         const firstPart = item.substring(0, lastSpaceIndex).trim();
    //         const secondPart = item.substring(lastSpaceIndex + 1).trim();

    //         [firstPart, secondPart].forEach((col, index) => {
    //             const cell = document.createElement(index === 0 ? 'th' : 'td');
    //             cell.textContent = col;
    //             row.appendChild(cell);
    //         });
    //         table.appendChild(row);
    //     });

    //     contentDiv.appendChild(table);
    // });
    sections.forEach(section => {
        const [title, ...items] = section.split(']');
        const titleDiv = document.createElement('div');
        titleDiv.textContent = title;
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginTop = '20px';
        contentDiv.appendChild(titleDiv);

        const table = document.createElement('table');

        items.join(' ').split('|').forEach(item => {
            const row = document.createElement('tr');
            const trimmedItem = item.trim();

            if (trimmedItem.indexOf(' ') === -1) {
                const cell = document.createElement('th');
                cell.textContent = trimmedItem;
                row.appendChild(cell);
            } else {
                const lastSpaceIndex = trimmedItem.lastIndexOf(' ');
                const firstPart = trimmedItem.substring(0, lastSpaceIndex).trim();
                const secondPart = trimmedItem.substring(lastSpaceIndex + 1).trim();

                [firstPart, secondPart].forEach((col, index) => {
                    const cell = document.createElement(index === 0 ? 'th' : 'td');
                    cell.textContent = col;
                    row.appendChild(cell);
                });
            }
            table.appendChild(row);
        });

        contentDiv.appendChild(table);
    });

    // 요리 방법
    const instructionDiv = document.getElementById('description');
    const instructionArray = recipe.description.split(/(?=\d+\.)/).filter(Boolean);
    let stepCounter = 1;

    instructionArray.forEach(instruction => {
        const currentStep = `${stepCounter}.`;
        if (instruction.trim().startsWith(currentStep)) {
            const p = document.createElement('p');
            p.textContent = instruction.trim();
            instructionDiv.appendChild(p);
            stepCounter++;
        }
    });

    // 뒤로 가기 버튼
    document.getElementById("recipe-details-goback").addEventListener("click", (e) => {
        history.back();
    })

    // 로딩화면 제거
    document.getElementById('loading-screen').style.display = 'none';
});
