document.addEventListener("DOMContentLoaded", async function () {
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
    document.querySelectorAll(".recipe-detail-rowflex-div div")[0].innerText =
        recipe.recipe_amount;
    document.querySelectorAll(".recipe-detail-rowflex-div div")[1].innerText =
        recipe.recipe_time;
    document.querySelectorAll(".recipe-detail-rowflex-div div")[2].innerText =
        recipe.recipe_difficult;

    // 재료 제목과 테이블 설정
    const sections = recipe.ingredients
        .split("[")
        .filter(Boolean)
        .map((section) => section.trim());
    const contentDiv = document.getElementById("ingredient-wrapper");

    sections.forEach((section) => {
        const [title, ...items] = section.split("]");
        const titleDiv = document.createElement("div");
        titleDiv.textContent = title;
        titleDiv.style.fontWeight = "bold";
        titleDiv.style.marginTop = "20px";
        contentDiv.appendChild(titleDiv);

        const table = document.createElement("table");

        items
            .join(" ")
            .split("|")
            .forEach((item) => {
                const row = document.createElement("tr");
                const trimmedItem = item.trim();

                if (trimmedItem.indexOf(" ") === -1) {
                    const cell = document.createElement("th");
                    cell.textContent = trimmedItem;
                    row.appendChild(cell);
                } else {
                    const lastSpaceIndex = trimmedItem.lastIndexOf(" ");
                    const firstPart = trimmedItem
                        .substring(0, lastSpaceIndex)
                        .trim();
                    const secondPart = trimmedItem
                        .substring(lastSpaceIndex + 1)
                        .trim();

                    [firstPart, secondPart].forEach((col, index) => {
                        const cell = document.createElement(
                            index === 0 ? "th" : "td"
                        );
                        cell.textContent = col;
                        row.appendChild(cell);
                    });
                }
                table.appendChild(row);
            });

        contentDiv.appendChild(table);
    });

    // 요리 방법
    const instructionDiv = document.getElementById("description");
    const instructionArray = recipe.description
        .split(/(?=\d+\.)/)
        .filter(Boolean);
    let stepCounter = 1;

    instructionArray.forEach((instruction) => {
        const currentStep = `${stepCounter}.`;
        if (instruction.trim().startsWith(currentStep)) {
            const p = document.createElement("p");
            p.textContent = instruction.trim();
            instructionDiv.appendChild(p);
            stepCounter++;
        }
    });

    // 뒤로 가기 버튼
    document
        .getElementById("recipe-details-goback")
        .addEventListener("click", (e) => {
            history.back();
        });

    // 로딩화면 제거
    document.getElementById("loading-screen").style.display = "none";
});
