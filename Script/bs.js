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
// const fetchPostWithRetry = async (url, data = {}, options = {}, retries = 1) => {
//     try {
//         const response = await axios.post(url, data, options);
//         return response;
//     } catch (e) {
//         if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
//             console.log("Access token expired. Fetching new token...");
//             await refreshAccessToken();
//             return fetchPostWithRetry(url, data, options, retries - 1);
//         } else {
//             throw e;
//         }
//     }
// }
// 재시도를 포함한 patch fetch
const fetchPatchWithRetry = async (
    url,
    data = {},
    options = {},
    retries = 1
) => {
    try {
        const response = await axios.patch(url, data, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchPatchWithRetry(url, data, options, retries - 1);
        } else {
            throw e;
        }
    }
};
// 재시도를 포함한 delete fetch
const fetchDeleteWithRetry = async (
    url,
    data = {},
    options = {},
    retries = 1
) => {
    try {
        const response = await axios.delete(url, data, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchPatchWithRetry(url, data, options, retries - 1);
        } else {
            throw e;
        }
    }
};

// 현재 날짜와 시간 정보 받아오기
function getCurrentDateAndTime(dateTimeString = null) {
    const now = dateTimeString ? new Date(dateTimeString) : new Date();

    // 날짜를 yyyy-mm-dd 형식으로 변환
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(now.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    // 시간을 hh:mm 형식으로 변환
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    return { date, time };
}

// 전체 유저 데이타
const data = {};
// DOM 로딩
document.addEventListener("DOMContentLoaded", async () => {
    // 시간 요소
    const timePicker = document.getElementById("timepicker");
    const timeDisplay = document.getElementById("current-time");
    // 날짜 오소
    const calendar = document.getElementById("calendar");
    const calendarHeader = document.getElementById("calendar-header");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // 날짜 정보와 시간 받아오기
    const { date, time } = getCurrentDateAndTime();
    data.date = date;
    date.time = time;

    console.log("current : ", data);

    // 쿼리 정보 가져오기
    // 쿼리 스트링 분리
    const urlParams = new URLSearchParams(window.location.search);
    // 쿼리 스트링을 객체로 변환 (만약 date가 존재하면 덮어씌워질거다)
    urlParams.forEach((value, key) => {
        data[key] = value;
    });
    console.log("query :", data);

    // 쿼리 정보에 id가 있으면 해당 id정보를 받아온다
    if (data.bsl_id) {
        try {
            const response = await fetchGetWithRetry("/api/blood-sugar-logs", {
                params: {
                    bsl_id: data.bsl_id,
                },
                withCredentials: true,
            });
            const responseData = response.data.data.blood_sugar_logs[0];
            // 시간 정보
            const current = getCurrentDateAndTime(responseData.record_time);
            data.date = current.date;
            data.time = current.time;
            // 혈당 및 다른 정보
            data.blood_sugar = responseData.blood_sugar;
            data.record_type = responseData.record_type;
            data.comments = responseData.comments;
        } catch (e) {
            // 정보를 못 받았다 (왜냐)
            Swal.fire({
                title: "정보 획득 실패",
                text: "관리자에게 문의 바랍니다.",
                icon: "error",
                confirmButtonText: "확인",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/";
                }
            });
        }
    }
    console.log("axios :", data);

    // 날짜 표시
    generateCalendar(new Date(data.date));
    // 시간 표시
    timeDisplay.textContent = data.time;
    timePicker.value = data.time;

    // 기록 데이터에 받아온 데이터 입력

    // 요소 기능
    // TODO : 뒤로 가기

    // TimePicker
    timeDisplay.addEventListener("click", () => {
        timePicker.style.display = "block";
        timeDisplay.style.display = "none";
        timePicker.focus();
        timePicker.click();
    });
    timePicker.addEventListener("blur", function () {
        timePicker.style.display = "none";
        timeDisplay.style.display = "block";
    });
    timePicker.addEventListener("change", function () {
        const selectedTime = timePicker.value;
        timeDisplay.textContent = selectedTime;
        timePicker.style.display = "none";
        timeDisplay.style.display = "block";
    });

    // 캘린더
    function updateHeader(date) {
        const options = { year: "numeric", month: "long" };
        calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
    }

    function generateCalendar(selectedDate) {
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
            });
            calendar.appendChild(dayDiv);
        }
        updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
        record_date = formatDate(selectedDate);
    }
});

const selectElement = document.getElementById("bs");
// const selectedValue = selectElement.value;
let record_date = "";
let record_time = "";

// 현재 시간 표시 함수
function displayCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    // const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}`;
    document.getElementById("current-time").textContent = currentTimeString;

    record_time = `${hours}:${minutes}:00`;
}

// 현재 시간 표시 초기 호출
displayCurrentTime();

// DOM 로딩
document.addEventListener("DOMContentLoaded", () => {
    // URL 파라미터로 전달된 날짜를 받아옵니다.
    const dateParam = getParameterByName("date");
    let currentDate = new Date(); // 현재 날짜로 초기화
    if (dateParam) {
        currentDate = new Date(dateParam);
    }

    // const calendar = document.getElementById("calendar");
    // const calendarHeader = document.getElementById("calendar-header");
    // const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // // let currentDate = new Date(); // 현재 날짜로 초기화

    // function updateHeader(date) {
    //     const options = { year: "numeric", month: "long" };
    //     calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
    // }

    // function generateCalendar(selectedDate) {
    //     calendar.innerHTML = ""; // 기존 캘린더 내용 제거

    //     const startDate = new Date(selectedDate);
    //     startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

    //     for (let i = 0; i < 7; i++) {
    //         const date = new Date(startDate);
    //         date.setDate(startDate.getDate() + i);

    //         const dayDiv = document.createElement("div");
    //         dayDiv.classList.add("day");
    //         if (date.toDateString() === selectedDate.toDateString()) {
    //             dayDiv.classList.add("selected");
    //         }
    //         dayDiv.innerHTML = `${date.getDate()}<br>${
    //             daysOfWeek[date.getDay()]
    //         }`;
    //         dayDiv.addEventListener("click", () => {
    //             generateCalendar(date); // 새로운 날짜 생성
    //             updateHeader(date); // 헤더 업데이트
    //         });
    //         calendar.appendChild(dayDiv);
    //     }
    //     updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
    //     record_date = formatDate(selectedDate);

    //     // console.log(record_date);
    //     // console.log(record_time);
    // }

    // // Infinite scroll logic
    // // let isLoading = false;

    // // function handleScroll() {
    // //     if (isLoading) return;

    // //     const container = document.getElementById("calendar-container");
    // //     const { scrollLeft, scrollWidth, clientWidth } = container;

    // //     if (scrollLeft + clientWidth >= scrollWidth - 10) {
    // //         // 스크롤이 오른쪽 끝에 가까워지면 다음 날짜 로드
    // //         isLoading = true;
    // //         loadNextDays();
    // //         setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
    // //     } else if (scrollLeft <= 10) {
    // //         // 스크롤이 왼쪽 끝에 가까워지면 이전 날짜 로드
    // //         isLoading = true;
    // //         loadPreviousDays();
    // //         setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
    // //     }
    // // }

    // // document
    // //     .getElementById("calendar-container")
    // //     .addEventListener("scroll", handleScroll);

    // // 초기화
    // generateCalendar(currentDate);
});

// URL 파라미터에서 날짜를 가져오는 함수
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// API 연동 문제

// 아침 식전 ~ 저녁 식후, 취침 전 등 중간에 공백 들어간 옵션들만 오류 남.
// 공복, 실시간은 제대로 연동
// 공복, 실시간도 '아침 식전 ~ 저녁 식후, 취침 전 등 공백 들어간 옵션' 선택 후 다시 선택하면 오류난 횟수만큼 공복, 실시간 값이 입력됨
// ex3) 2번 오류난 후 공복 입력시 3번 등록

// 식전, 식후 혈당 범위 제대로 됨
// css 맞추기

document
    .getElementById("blood-sugar-save")
    .addEventListener("click", async () => {
        // 혈당 값이 유효한지 확인하는 함수
        function validateBloodSugar(value) {
            if (value === "" || isNaN(value)) {
                alert("혈당 값을 올바르게 입력하세요."); // 유효하지 않은 입력에 대한 경고
                return false;
            }
            return true;
        }

        // 혈당 값을 저장하는 함수
        async function saveBloodSugar(selectedValue) {
            let bloodSugarValue;

            // 선택된 식사 유형에 따라 혈당 값 가져오기
            if (
                selectedValue === "아침 식전" ||
                selectedValue === "점심 식전" ||
                selectedValue === "저녁 식전" ||
                selectedValue === "공복" ||
                selectedValue === "취침 전" ||
                selectedValue === "실시간"
            ) {
                bloodSugarValue =
                    document.getElementById("record-bs-before").value; // 식전 혈당
            } else {
                bloodSugarValue =
                    document.getElementById("record-bs-after").value; // 식후 혈당
            }

            // 혈당 값 유효성 확인
            if (!validateBloodSugar(bloodSugarValue)) {
                return;
            }

            try {
                const response = await axios.post("/api/blood-sugar-logs", {
                    blood_sugar: bloodSugarValue, // 선택된 혈당 값
                    record_type: selectedValue, // 선택된 식사 유형
                    record_time: `${record_date} ${record_time}`, // 기록 시간
                    comments: document.getElementById("eat-memo").value, // 추가 메모
                });

                const exercise = response.data.data; // API 응답에서 운동 데이터를 가져옴
                console.log("exercise success:", exercise); // 성공 로그
                Swal.fire({
                    icon: "success",
                    title: "혈당 기록이 성공적으로 저장되었습니다.",
                }); // 성공적으로 저장되었음을 알림
            } catch (error) {
                console.error("exercise error:", error); // 에러 로그를 콘솔에 출력
                Swal.fire({
                    icon: "error",
                    title: "혈당 기록 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
                }); // 오류 알림
            }
        }

        // submit 버튼 클릭 이벤트 리스너
        document
            .getElementById("blood-sugar-save")
            .addEventListener("click", async () => {
                const selectedValue =
                    document.getElementById("my-select").value; // 선택된 값을 가져옵니다.
                await saveBloodSugar(selectedValue); // 혈당 값을 저장
            });

        // 선택된 옵션에 따라 div2와 div1의 내용을 업데이트하는 코드
        const mySelect = document.getElementById("my-select");
        const div1 = document.getElementById("div1");
        const div2 = document.getElementById("div2");

        // 초기화할 때 div2의 초기 내용 저장
        const initialDiv1Content = div1.innerHTML;

        // select 요소의 onchange 이벤트 핸들러 설정
        mySelect.addEventListener("change", function () {
            const selectedOption = mySelect.value;

            if (
                [
                    "아침 식전",
                    "점심 식전",
                    "저녁 식전",
                    "공복",
                    "취침 전",
                    "실시간",
                ].includes(selectedOption)
            ) {
                div2.style.display = "none";
                div1.innerHTML = initialDiv1Content; // div1를 초기 내용으로 복원
            } else {
                div2.style.display = ""; // div2를 보이게 설정
                div1.innerHTML = ""; // div1 초기화
            }
        });
    });

// 날짜와 시간을 표시하는 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// HTML 요소들을 가져오기
const mySelect = document.getElementById("my-select");
const div1 = document.getElementById("div1");
const div2 = document.getElementById("div2");

// 초기화할 때 div2의 초기 내용 저장
const initialDiv1Content = div1.innerHTML;

// select 요소의 onchange 이벤트 핸들러 설정
mySelect.addEventListener("change", function () {
    const selectedOption = mySelect.value;

    if (selectedOption === "아침 식전") {
        // 다른 옵션이 선택된 경우 div2를 숨기고 초기 내용으로 복원
        div2.style.display = "none";
        div1.innerHTML = initialDiv1Content;
        // div2의 내용을 숨기고 초기화
        div2.style.visibility = "hidden";
    } else if (selectedOption === "점심 식전") {
        div2.style.display = "none";
        div1.innerHTML = initialDiv1Content;
        div2.style.visibility = "hidden";
    } else if (selectedOption === "저녁 식전") {
        div2.style.display = "none";
        div1.innerHTML = initialDiv1Content;
        div2.style.visibility = "hidden";
    } else if (selectedOption === "공복") {
        div2.style.display = "none";
        div1.innerHTML = initialDiv1Content;
        div2.style.visibility = "hidden";
    } else if (selectedOption === "취침 전") {
        div2.style.display = "none";
        div1.innerHTML = initialDiv1Content;
        div2.style.visibility = "hidden";
    } else if (selectedOption === "실시간") {
        div2.style.display = "none";
        div1.innerHTML = initialDiv1Content;
        div2.style.visibility = "hidden";
    } else if (selectedOption === "아침 식후") {
        // 옵션 4 선택 시 div2의 내용을 div1로 이동
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = ""; // div1를 보이게 설정

        // div1의 내용 초기화 (선택 시 필요에 따라)
        // div1.innerHTML = '';
    } else if (selectedOption === "점심 식후") {
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = "";
    } else if (selectedOption === "저녁 식후") {
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = "";
    }
});

function checkLevelBsBefore() {
    let inputValue = parseFloat(
        document.getElementById("record-bs-before").value
    );
    let resultBox1 = document.getElementById("resultBox1");

    if (isNaN(inputValue)) {
        resultBox1.style.backgroundColor = "#FFFFFF"; // 입력 값이 숫자가 아닌 경우 흰색
    } else if (inputValue < 100) {
        resultBox1.style.backgroundColor = "#66CC66"; // 초록색 (정상)
    } else if (inputValue >= 100 && inputValue <= 126) {
        resultBox1.style.backgroundColor = "#FFFF99"; // 노란색 (경고)
    } else {
        resultBox1.style.backgroundColor = "#FF9999"; // 빨간색 (위험)
    }
}

function checkLevelBsAfter() {
    let inputValue2 = parseFloat(
        document.getElementById("record-bs-after").value
    );
    let resultBox2 = document.getElementById("resultBox2");

    if (isNaN(inputValue2)) {
        resultBox2.style.backgroundColor = "#FFFFFF"; // 입력 값이 숫자가 아닌 경우 흰색
    } else if (inputValue2 < 140) {
        resultBox2.style.backgroundColor = "#66CC66"; // 초록색 (정상)
    } else if (inputValue2 >= 140 && inputValue2 < 200) {
        resultBox2.style.backgroundColor = "#FFFF99"; // 노란색 (경고)
    } else {
        resultBox2.style.backgroundColor = "#FF9999"; // 빨간색 (위험)
    }
}
