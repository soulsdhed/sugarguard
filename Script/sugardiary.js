// 재시도가 필요한 fetch의 경우 아래 함수들을 반드시 가져가야한다
// refresh함수를 통한 accessToken 재발행 받기
const refreshAccessToken = async () => {
    try {
        const response = await axios.post(
            "/api/auth/token",
            {},
            {
                withCredentials: true,
            }
        );
        // const { accessToken } = response.data;
        // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (e) {
        console.error("Failed to refresh access token:", e);
        throw e;
    }
};
// 재시도를 포함한 get fetch
const fetchGetWithRetry = async (url, options = {}, retries = 1) => {
    try {
        const response = await axios.get(url, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchGetWithRetry(url, options, retries - 1);
        } else {
            throw e;
        }
    }
};
// // 재시도를 포함한 post fetch
// const fetchPostWithRetry = async (
//     url,
//     data = {},
//     options = {},
//     retries = 1
// ) => {
//     try {
//         const response = await axios.post(url, data, options);
//         return response;
//     } catch (e) {
//         if (
//             e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
//             retries > 0
//         ) {
//             console.log("Access token expired. Fetching new token...");
//             await refreshAccessToken();
//             return fetchPostWithRetry(url, data, options, retries - 1);
//         } else {
//             throw e;
//         }
//     }
// };
// // 재시도를 포함한 patch fetch
// const fetchPatchWithRetry = async (url, data = {}, options = {}, retries = 1) => {
//     try {
//         const response = await axios.patch(url, data, options);
//         return response;
//     } catch (e) {
//         if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
//             console.log("Access token expired. Fetching new token...");
//             await refreshAccessToken();
//             return fetchPatchWithRetry(url, data, options, retries - 1);
//         } else {
//             throw e;
//         }
//     }
// }

document.addEventListener("DOMContentLoaded", function () {
    let toggleState = false;
    let originalButtonPosition = { bottom: "70px", right: "20px" };
    let mainToggleButton = document.getElementById("main-toggle-button");
    let menuButtons = document.getElementById("menu-buttons");
    let recordsContainer = document.getElementById("records-container");
    let recordButtons = document.querySelectorAll(
        "#exercise-button, #weight-record-button, #blood-pressure-button, #meal-sugar-button, #sugar-button"
    );
    let lastClickedButton = null;
    let currentYear = "";
    let currentMonth = "";
    let currentDay = "";

    // 뒤로 가기 버튼
    document
        .getElementById("sugardiary-goback")
        .addEventListener("click", (e) => {
            // history.back();
            // 여기선 메인으로
            window.location.href = "/";
        });

    recordButtons.forEach((button) => (button.disabled = true));

    mainToggleButton.addEventListener("click", function () {
        toggleState = !toggleState;
        this.classList.toggle("rotate");

        if (toggleState) {
            menuButtons.classList.remove("hidden");
            document
                .querySelectorAll(".floating-button-container")
                .forEach((el) => el.classList.add("show"));
            document
                .querySelectorAll(".floating-button-text")
                .forEach((el) => (el.style.display = "block"));
            recordButtons.forEach((button) => (button.disabled = false));
            console.log("열림");
        } else {
            document
                .querySelectorAll(".floating-button-container")
                .forEach((el) => el.classList.remove("show"));
            document
                .querySelectorAll(".floating-button-text")
                .forEach((el) => (el.style.display = "none"));
            setTimeout(function () {
                menuButtons.classList.add("hidden");
                recordButtons.forEach((button) => (button.disabled = true));
            }, 300);
        }
    });
    function convertToKSTAndFormat(record_time) {
        // Create a Date object from the record_time string
        const date = new Date(record_time);

        // Convert the date to KST (UTC+9)
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Seoul",
            hourCycle: "h23", // 24시간 형식으로 표시
        };
        const formatter = new Intl.DateTimeFormat("ko-KR", options);
        const formattedTime = formatter.format(date);

        return formattedTime;
    }

    // TODO : 삭제버튼 floation button에 가려서 안먹히는 것 수정
    // TODO : 이미 있는 기록의 경우에는 삭제 경고 알림창 띄우기

    function addRecord(recordType, imgUrl, recordClass, item = null) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        let timeString = `${hours}:${minutes}`;
        let valueString = "";
        let link = "";

        // TODO : 나머지 4개도 해야함
        if (recordClass == "exercise-record") {
            link = "/exercise";
            valueString = "0 kcal";
            if (item != null) {
                link = `${link}?el_id=${item.el_id}`;
                valueString = `${item.calories_burned} kcal`;
                timeString = convertToKSTAndFormat(item.record_time);
            }
        } else if (recordClass == "weight-record") {
            link = "";
            valueString = "0 kg";
            if (item != null) link = `${link}?wl_id=${item.wl_id}`;
        } else if (recordClass == "blood-pressure-record") {
            link = "";
            valueString = "0~0 mmHg";
            if (item != null) link = `${link}?bpl_id=${item.bpl_id}`;
        } else if (recordClass == "mealrecord-record") {
            link = "/mealrecord";
            valueString = "0 kcal";
            if (item != null) link = `${link}?ml_id=${item.ml_id}`;
        } else if (recordClass == "sugar-record") {
            link = "/bs";
            valueString = "0 mg/dl";
            if (item != null) link = `${link}?bsl_id=${item.bsl_id}`;
        }
        console.log(item);
        console.log(link);

        const recordHtml = `
            <div class="record-title">
                <img src="${imgUrl}" alt="" style="width: 24px; height: 24px; margin-right: 8px;">
                <div id="record-title-text">${recordType}</div>
            </div>
            <div class="record-time">${timeString}</div>
            <i class="fas fa-times close-icon" onclick="removeRecord(event, this)" style="cursor: pointer;"></i>
            <div class="record-value">${valueString}</div>
        `;

        const divContainer = document.createElement("div");
        divContainer.classList.add("record-entry");
        divContainer.classList.add(recordClass);
        divContainer.innerHTML = recordHtml;
        recordsContainer.insertAdjacentElement("beforeend", divContainer);

<<<<<<< HEAD
        let link = "";
        if (recordClass == "exercise-record") {
            link = "/exercise";
        } else if (recordClass == "weight-record") {
            link = "/weight";
        } else if (recordClass == "blood-pressure-record") {
            link = "";
        } else if (recordClass == "mealrecord-record") {
            link = "/mealrecord";
        } else if (recordClass == "sugar-record") {
            link = "/bs";
        }

=======
>>>>>>> c36fb95d4088b9a1f0c9fa2957d3b6af5e59ec1e
        divContainer.addEventListener("click", () => {
            console.log(currentYear, currentMonth, currentDay);
            if (item != null) {
                window.location.href = `${link}`;
            } else {
                window.location.href = `${link}?date=${currentYear}-${currentMonth}-${currentDay}`;
            }
        });

        // recordsContainer.insertAdjacentHTML("beforeend", recordHtml);
        recordsContainer.scrollTop = recordsContainer.scrollHeight;

        if (lastClickedButton) {
            lastClickedButton.style.bottom = originalButtonPosition.bottom;
            lastClickedButton.style.right = originalButtonPosition.right;
            lastClickedButton = null;
        }
        mainToggleButton.style.bottom = originalButtonPosition.bottom;
        mainToggleButton.style.right = originalButtonPosition.right;
    }

    window.removeRecord = function (e, element) {
        e.stopPropagation();
        element.parentElement.remove();
        recordsContainer.scrollTop = recordsContainer.scrollHeight;

        // TODO : 기록이 있는 경우에는 삭제하면 삭제 api가 작동하도록 (또 만들어야 한다 하아....)
    };

    function triggerMainToggleButton() {
        mainToggleButton.click();
    }

    // TODO : 추가 버튼 누르면 자동 스크롤 최하단으로 가게끔
    document
        .getElementById("exercise-button")
        .addEventListener("click", function () {
            lastClickedButton = this;
            addRecord(
                "운동 기록",
                "https://res.cloudinary.com/difzc7bsf/image/upload/v1721719663/002_cuhgi9.png",
                "exercise-record"
            );
            triggerMainToggleButton();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        });

    document
        .getElementById("weight-record-button")
        .addEventListener("click", function () {
            lastClickedButton = this;
            addRecord(
                "체중 기록",
                "https://res.cloudinary.com/difzc7bsf/image/upload/v1721888337/image-removebg-preview_3_t28f17.png",
                "weight-record"
            );
            triggerMainToggleButton();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        });

    document
        .getElementById("blood-pressure-button")
        .addEventListener("click", function () {
            lastClickedButton = this;
            addRecord(
                "혈압 기록",
                "https://res.cloudinary.com/difzc7bsf/image/upload/v1721983336/%EC%A0%9C%EB%AA%A9%EC%9D%84-%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94_-009_basbm8.png",
                "blood-pressure-record"
            );
            triggerMainToggleButton();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        });

    document
        .getElementById("meal-sugar-button")
        .addEventListener("click", function () {
            lastClickedButton = this;
            addRecord(
                "식사 기록",
                "https://res.cloudinary.com/difzc7bsf/image/upload/v1721885477/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94_-005_tvsy8t.png",
                "mealrecord-record"
            );
            triggerMainToggleButton();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        });

    document
        .getElementById("sugar-button")
        .addEventListener("click", function () {
            lastClickedButton = this;
            addRecord(
                "혈당 기록",
                "https://res.cloudinary.com/difzc7bsf/image/upload/v1721719247/blood_h0b2io.png",
                "sugar-record"
            );
            triggerMainToggleButton();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        });

    // 캘린더
    const calendar = document.getElementById("calendar");
    const calendarHeader = document.getElementById("sugar-calendar-header");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let currentDate = new Date(); // 현재 날짜로 초기화

    function updateHeader(date) {
        const options = { year: "numeric", month: "long" };
        calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
    }

    async function generateCalendar(selectedDate) {
        calendar.innerHTML = ""; // 기존 캘린더 내용 제거

        const startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            if (date.toDateString() === selectedDate.toDateString()) {
                dayDiv.classList.add("selected");
            }
            dayDiv.innerHTML = `${date.getDate()}<br>${
                daysOfWeek[date.getDay()]
            }`;
            dayDiv.addEventListener("click", () => {
                generateCalendar(date); // 새로운 날짜 생성
                updateHeader(date); // 헤더 업데이트
                // 추가적인 기능이 필요한 경우 여기에 추가합니다.
            });
            calendar.appendChild(dayDiv);
        }
        updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
        console.log("Year: ", selectedDate.getYear() + 1900);
        console.log("Month:", selectedDate.getMonth() + 1); // 0부터 시작하므로 +1
        console.log("Day:", selectedDate.getDate());

        currentYear = selectedDate.getYear() + 1900;
        currentMonth = (selectedDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        currentDay = selectedDate.getDate().toString().padStart(2, "0");
        console.log(currentDate);

        // 기록지 전부 삭제
        document.querySelectorAll(".record-entry").forEach((item) => {
            item.remove();
        });

        // TODO : 기록 api call (나머지 4개도 받아야 함)
        try {
            const response = await fetchGetWithRetry("/api/exercise-logs", {
                params: {
                    startDate: `${currentYear}-${currentMonth}-${currentDay}`,
                    endDate: `${currentYear}-${currentMonth}-${currentDay}`,
                },
                withCredentials: true,
            });
            console.log(response);
            console.log(response.data.data.exercise_logs);

            response.data.data.exercise_logs.forEach((item) => {
                addRecord(
                    "운동 기록",
                    "https://res.cloudinary.com/difzc7bsf/image/upload/v1721719663/002_cuhgi9.png",
                    "exercise-record",
                    item
                );
            });
        } catch (e) {
            console.log(e);
        }
    }

    generateCalendar(currentDate); // 초기화
});
