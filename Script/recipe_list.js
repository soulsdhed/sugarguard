// 재시도가 필요한 fetch의 경우 아래 함수들을 반드시 가져가야한다
// refresh함수를 통한 accessToken 재발행 받기
const refreshAccessToken = async () => {
    try {
        const response = await axios.post("/api/auth/token", {}, {
            withCredentials: true,
        });
        // const { accessToken } = response.data;
        // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (e) {
        console.error("Failed to refresh access token:", e);
        throw e;
    }
}
// 재시도를 포함한 get fetch
const fetchGetWithRetry = async (url, options = {}, retries = 1) => {
    try {
        const response = await axios.get(url, options);
        return response;
    } catch (e) {
        if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchGetWithRetry(url, options, retries - 1);
        } else {
            throw e;
        }
    }
}

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

// 로딩 창 띄우기
const showLoading = (photo_url) => {
    let title = 'AI 이미지 분석중...'
    let text = "이미지를 분석 중입니다..."
    if (!photo_url) {
        title = "추천 레시피를 받아오는 중..."
        text = "재료를 분석 중입니다...'"
    }
    Swal.fire({
        title: title,
        text: text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

// 로딩 창 닫기
const hideLoading = () => {
    Swal.close();
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
    // console.log(params);
    // 로딩 알림창
    showLoading(params.photo_url);

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
        // 레시피 api를 통해서 레시피 받아오기 (재시도 가능)
        const response = await fetchGetWithRetry("/api/recipes", options = {
            params: {
                have: params.have,
                amount: params.amount,
                time: params.time,
                difficult: params.difficult,
                photo_url: params.photo_url
            }, withCredentials: true
        })
        console.log(response.data.data.recipes);
        renderRecipes(response.data.data.recipes);
    }

    // 뒤로 가기 버튼
    document.getElementById("recipe-list-goback").addEventListener("click", (e) => {
        history.back();
    })

    hideLoading();
    // 로딩화면 제거
    // document.getElementById('loading-screen').style.display = 'none';
});
