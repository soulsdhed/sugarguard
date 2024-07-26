// a 태그를 여러개 눌렸을때 색깔 유지
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#recipe-name a").forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault(); // 링크 클릭 기본 동작 방지
            anchor.classList.toggle("active"); // 'active' 클래스 토글
        });
    });


    // 검색 버튼 클릭 이벤트 핸들러 추가
    document
        .getElementById("search-button")
        .addEventListener("click", async (e) => {
            e.preventDefault(); // 폼의 기본 동작 방지

            // 활성화된 a 태그들 선택
            const activeLinks = document.querySelectorAll(
                "#recipe-name a.active"
            );

            let have = [];
            let amount = [];
            let time = [];
            let difficult = [];
            // 활성화된 a 태그들의 텍스트를 로그에 출력
            activeLinks.forEach((link) => {
                const content = link.querySelector("span").textContent;

                if (
                    ["1인분", "2인분", "3인분", "4인분이상"].includes(content)
                ) {
                    amount.push(content);
                } else if (
                    ["15분이내", "30분이내", "60분이내", "2시간이상"].includes(
                        content
                    )
                ) {
                    time.push(content);
                } else if (
                    ["아무나", "초급", "중급", "고급"].includes(content)
                ) {
                    difficult.push(content);
                } else {
                    have.push(content);
                }
            });

            // TODO : 이미지 없는 레시피 추천
            console.log(have);
            console.log(amount);
            console.log(time);
            console.log(difficult);

            console.log(have.join(", "));

            try {
                const res = await axios.get("/api/recipes", {
                    params: {
                        have: have.join(", "),
                    },
                    withCredentials: true, // 쿠키를 포함하여 요청
                });
                console.log(res);
            } catch (err) {
                console.error(err);
            }
        });
});

// 카메라 앱 작동 (버튼)
document.getElementById("recipe-camera").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("cameraInput").click();
});

// 카메라 앱 작동 (실제 작동)
document
    .getElementById("cameraInput")
    .addEventListener("change", async (event) => {
        const file = event.target.files[0];
        console.log(file);

        // 파일이 있다면
        if (file) {
            // 업로드 요청
            try {
                // 로그인
                const reslog = await axios.post("/api/users/login", {
                    userId: "test5",
                    password: "12341234",
                });
                console.log(reslog);

                // presigned URL 요청
                const res = await axios.post(
                    "/api/auth/upload-image/recipe-recommend",
                    {
                        fileName: file.name,
                        fileType: file.type,
                    },
                    {
                        withCredentials: true,
                    }
                );

                // presigned URL 받기
                const { key, url } = res.data.data;

                // S3에 파일 업로드
                await axios.put(url, file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                // TODO : 레시피 추천 받기
                // const recipePostRes = await axios.post("/api/recipe", {
                //     // TODO : 레시피 내용 보내기
                //     photo_url: key,
                // });

                event.target.value = "";
            } catch (err) {
                console.log(err);
                //TODO : 오류 핸들링 필요
            }
        }
    });
