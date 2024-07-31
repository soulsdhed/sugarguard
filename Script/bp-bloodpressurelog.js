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
// 재시도를 포함한 post fetch
const fetchPostWithRetry = async (
    url,
    data = {},
    options = {},
    retries = 1
) => {
    try {
        const response = await axios.post(url, data, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchPostWithRetry(url, data, options, retries - 1);
        } else {
            throw e;
        }
    }
};
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

    console.log(time);
    return { date, time };
}

// 날짜와 시간을 표시하는 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// 전체 유저 데이타
const data = {};

document.addEventListener("DOMContentLoaded", async () => {
    // 뒤로 가기 버튼
    const backButton = document.getElementById("bp-goback");
    // 저장 버튼
    const saveButton = document.getElementById("bp-save");
    // 시간 요소
    const timePicker = document.getElementById("timepicker");
    const timeDisplay = document.getElementById("bp-current-time");
    // 날짜 오소
    const calendar = document.getElementById("calendar");
    const calendarHeader = document.getElementById("calendar-header");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // 혈당 정보 요소
    const bloodPressureMaxInput = document.getElementById(
        "bloodpressurelog_detail_input_max"
    );
    const bloodPressureMinInput = document.getElementById(
        "bloodpressurelog_detail_input_min"
    );
    const commentstInupt = document.getElementById("bp-memo");

    // 날짜 정보와 시간 받아오기
    const { date, time } = getCurrentDateAndTime();
    data.date = date;
    data.time = time;

    // 쿼리 정보 가져오기
    // 쿼리 스트링 분리
    const urlParams = new URLSearchParams(window.location.search);
    // 쿼리 스트링을 객체로 변환 (만약 date가 존재하면 덮어씌워질거다)
    urlParams.forEach((value, key) => {
        data[key] = value;
    });
    console.log("query :", data);

    // 쿼리 정보에 id가 있으면 해당 id정보를 받아온다
    if (data.bpl_id) {
        try {
            const response = await fetchGetWithRetry(
                "/api/blood-pressure-logs",
                {
                    params: {
                        bpl_id: data.bpl_id,
                    },
                    withCredentials: true,
                }
            );
            const responseData = response.data.data.blood_pressure_logs[0];
            // 시간 정보
            const current = getCurrentDateAndTime(responseData.record_time);
            data.date = current.date;
            data.time = current.time;
            // 혈당 및 다른 정보
            data.blood_pressure_min = responseData.blood_pressure_min;
            data.blood_pressure_max = responseData.blood_pressure_max;
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
    if (data.blood_pressure_min != null)
        bloodPressureMaxInput.value = data.blood_pressure_max;
    if (data.blood_pressure_max != null)
        bloodPressureMinInput.value = data.blood_pressure_min;
    if (data.comments != null) commentstInupt.value = data.comments;

    // 요소 기능
    // 저장하기
    saveButton.addEventListener("click", async (e) => {
        const bloodPressureMax = bloodPressureMaxInput.value;
        const bloodPressureMin = bloodPressureMinInput.value;
        const comments = commentstInupt.value;

        // 유효성 검사
        if (!bloodPressureMax || !bloodPressureMin) {
            return Swal.fire({
                title: "저장 오류",
                text: "혈압을 입력해주세요",
                icon: "warning",
            });
        }

        // 정보 문제가 없다면 저장하자!
        try {
            if (!data.bpl_id) {
                // 저장하기
                const response = await fetchPostWithRetry(
                    "/api/blood-pressure-logs",
                    {
                        blood_pressure_max: bloodPressureMax,
                        blood_pressure_min: bloodPressureMin,
                        comments: comments,
                        record_time: `${data.date} ${data.time}:00`,
                    },
                    { withCredentials: true }
                );
                console.log(response);
                return Swal.fire({
                    title: "기록 저장 성공",
                    text: "혈압 기록이 저장되었습니다.",
                    icon: "success",
                });
            } else {
                // 수정하기
                const response = await fetchPatchWithRetry(
                    "/api/blood-pressure-logs",
                    {
                        bpl_id: data.bpl_id,
                        blood_pressure_max: bloodPressureMax,
                        blood_pressure_min: bloodPressureMin,
                        comments: comments,
                        record_time: `${data.date} ${data.time}:00`,
                    },
                    { withCredentials: true }
                );
                console.log(response);
                return Swal.fire({
                    title: "기록 저장 성공",
                    text: "혈압 기록이 저장되었습니다.",
                    icon: "success",
                });
            }
        } catch (e) {
            console.log(e);
            return Swal.fire({
                title: "기록 저장 오류",
                text: "관리자에게 문의해주세요.",
                icon: "error",
            });
        }
    });

    // 뒤로 가기
    backButton.addEventListener("click", (e) => {
        history.back();
        // window.location.href = "/sugardiary";
    });

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
        // 데이터 업데이트
        data.date = formatDate(selectedDate);
    }
});

// document.addEventListener("DOMContentLoaded", () => {
//     // URL 파라미터에서 날짜를 가져오는 함수
//     function getParameterByName(name) {
//         const urlParams = new URLSearchParams(window.location.search);
//         return urlParams.get(name);
//     }

//     // URL 파라미터로 전달된 날짜를 받아옵니다.
//     const dateParam = getParameterByName("date");
//     let currentDate = new Date(); // 현재 날짜로 초기화
//     if (dateParam) {
//         currentDate = new Date(dateParam);
//     }

//     const calendar = document.getElementById("calendar");
//     const calendarHeader = document.getElementById("calendar-header");
//     const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//     function updateHeader(date) {
//         const options = { year: "numeric", month: "long" };
//         calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
//     }

//     function generateCalendar(selectedDate) {
//         calendar.innerHTML = ""; // 기존 캘린더 내용 제거

//         const startDate = new Date(selectedDate);
//         startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

//         for (let i = 0; i < 7; i++) {
//             const date = new Date(startDate);
//             date.setDate(startDate.getDate() + i);

//             const dayDiv = document.createElement("div");
//             dayDiv.classList.add("day");
//             if (date.toDateString() === selectedDate.toDateString()) {
//                 dayDiv.classList.add("selected");
//             }
//             dayDiv.innerHTML = `${date.getDate()}<br>${
//                 daysOfWeek[date.getDay()]
//             }`;
//             dayDiv.addEventListener("click", () => {
//                 generateCalendar(date); // 새로운 날짜 생성
//                 updateHeader(date); // 헤더 업데이트
//             });
//             calendar.appendChild(dayDiv);
//         }
//         updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
//         record_date = formatDate(selectedDate);

//         // console.log(record_date);
//         // console.log(record_time);
//     }

//     // Infinite scroll logic
//     let isLoading = false;

//     function handleScroll() {
//         if (isLoading) return;

//         const container = document.getElementById("calendar-container");
//         const { scrollLeft, scrollWidth, clientWidth } = container;

//         if (scrollLeft + clientWidth >= scrollWidth - 10) {
//             // 스크롤이 오른쪽 끝에 가까워지면 다음 날짜 로드
//             isLoading = true;
//             loadNextDays();
//             setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
//         } else if (scrollLeft <= 10) {
//             // 스크롤이 왼쪽 끝에 가까워지면 이전 날짜 로드
//             isLoading = true;
//             loadPreviousDays();
//             setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
//         }
//     }

//     document
//         .getElementById("calendar-container")
//         .addEventListener("scroll", handleScroll);

//     // 초기화
//     generateCalendar(currentDate);

//     // 현재 시간 표시 함수
//     function displayCurrentTime() {
//         const now = new Date();
//         const hours = String(now.getHours()).padStart(2, "0");
//         const minutes = String(now.getMinutes()).padStart(2, "0");
//         const currentTimeString = `${hours}:${minutes}`;
//         document.getElementById("bp-current-time").textContent =
//             currentTimeString;

//         record_time = `${hours}:${minutes}:00`;
//     }

//     // 현재 시간 표시 초기 호출
//     displayCurrentTime();
// });

// document.getElementById("bp-save").addEventListener("click", () => {
//     return Swal.fire({
//         title: "기록 저장 성공",
//         text: "혈압 기록이 저장되었습니다.",
//         icon: "success",
//     });
// });

// //post 설정
// const url = "/api/blood-pressure-logs";
// let blood_pressure_min_value = document.getElementById(
//     "bloodpressurelog_detail_input_min"
// ).value;
// let blood_pressure_max_value = document.getElementById(
//     "bloodpressurelog_detail_input_max"
// ).value;
// let bpUserData = {
//     blood_pressure_max: blood_pressure_max_value,
//     blood_pressure_min: blood_pressure_min_value,
// };
// function bpClick(event) {
//     event.preventDefault();
//     if (
//         blood_pressure_min_value === null ||
//         blood_pressure_min_value === undefined
//     ) {
//         Swal.fire({
//             icon: "error",
//             title: "이완기 혈압을 입력해주세요",
//         });
//         return next({
//             code: "VALIDATION_MISSING_FIELD",
//         });
//     } else if (
//         blood_pressure_max_value === null ||
//         blood_pressure_max_value === undefined
//     ) {
//         Swal.fire({
//             icon: "error",
//             title: "수축기 혈압을 입력해주세요",
//         });
//         return next({
//             code: "VALIDATION_MISSING_FIELD",
//         });
//     }
//     bpPostData(url, bpUserData);
// }

// //post 함수

// async function bpPostData(url, bpUserData) {
//     try {
//         const response = await axios.post(url, bpUserData, {
//             withCredentials: true,
//         });
//         console.log("Success:", response.bpUserData);
//     } catch (error) {
//         console.log("Error:", error);
//     }
// }
