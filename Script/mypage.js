document.addEventListener("DOMContentLoaded", async (e) => {
    // 혈당
    try {
        const response = await axios.get("/api/blood-sugar-logs/recent", {
            withCredentials: true,
        });
        // console.log(response.data.data.blood_sugar_logs[0].blood_sugar);
        document.querySelector("#mypage-blood-sugar-div h1").textContent =
            response.data.data.blood_sugar_logs[0].blood_sugar || 0;
    } catch (e) {
        console.log("error", e);
    }
    // 운동
    try {
        const response = await axios.get("/api/exercise-logs/recent", {
            withCredentials: true,
        });
        console.log(response.data.data.exercise_logs[0].calories_burned);
        document.querySelector("#mypage-exercise-div h1").textContent =
            response.data.data.exercise_logs[0].calories_burned || 0;
    } catch (e) {
        console.log("error", e);
    }
    // 식사
    try {
        const response = await axios.get("/api/meal-logs/recent", {
            withCredentials: true,
        });
        console.log(response.data.data.meal_logs[0].calories);
        document.querySelector("#mypage-meal-div h1").textContent =
            response.data.data.meal_logs[0].calories || 0;
    } catch (e) {
        console.log("error", e);
    }
    // 체중
    try {
        const response = await axios.get("/api/weight-logs/recent", {
            withCredentials: true,
        });
        console.log(response.data.data.weight_logs[0].weight);
        document.querySelector("#mypage-weight-div h1").textContent =
            parseFloat(
                Number(response.data.data.weight_logs[0].weight).toFixed(2)
            ) || 0;
    } catch (e) {
        console.log("error", e);
    }
    // 혈압
    try {
        const response = await axios.get("/api/blood-pressure-logs/recent", {
            withCredentials: true,
        });
        console.log(
            response.data.data.blood_pressure_logs[0].blood_pressure_min
        );
        console.log(
            response.data.data.blood_pressure_logs[0].blood_pressure_max
        );
        document.querySelector(
            "#mypage-blood-pressure-div h1"
        ).textContent = `${
            response.data.data.blood_pressure_logs[0].blood_pressure_min || 0
        }~${response.data.data.blood_pressure_logs[0].blood_pressure_max || 0}`;
    } catch (e) {
        console.log("error", e);
    }

    document
        .getElementById("mypage-logout-button")
        .addEventListener("click", (e) => {
            console.log("?");
            // 한번 더 물어보기
            Swal.fire({
                title: "로그아웃",
                text: "로그아웃하시겠습니까?",
                icon: "error",
                showCancelButton: true,
                confirmButtonText: "예",
                cancelButtonText: "아니오",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // 로그아웃 api 연결
                    try {
                        const res = await axios.post(
                            "/api/users/logout",
                            {},
                            {
                                withCredentials: true,
                            }
                        );
                        console.log(res);
                        location.reload();
                    } catch (e) {
                        Swal.fire(
                            "에러 발생",
                            "에러가 발생했습니다. 관리자에게 문의해주세요.",
                            "error"
                        );
                    }
                }
            });
        });
});

// chart 링크
const urls = [
    "/report/blood-sugar",
    "/report/exercise",
    "/report/meal",
    "/report/weight",
    "/report/blood-pressure",
];

document.querySelectorAll(".mypage_blood").forEach((element, index) => {
    element.addEventListener("click", (e) => {
        window.location.href = urls[index];
    });
});
