//달력,시간 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
    // URL 파라미터에서 날짜를 가져오는 함수
    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // URL 파라미터로 전달된 날짜를 받아옵니다.
    const dateParam = getParameterByName("date");
    let currentDate = new Date(); // 현재 날짜로 초기화
    if (dateParam) {
        currentDate = new Date(dateParam);
    }

    const calendar = document.getElementById("calendar");
    const calendarHeader = document.getElementById("calendar-header");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

        // console.log(record_date);
        // console.log(record_time);
    }

    // Infinite scroll logic
    let isLoading = false;

    function handleScroll() {
        if (isLoading) return;

        const container = document.getElementById("calendar-container");
        const { scrollLeft, scrollWidth, clientWidth } = container;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
            // 스크롤이 오른쪽 끝에 가까워지면 다음 날짜 로드
            isLoading = true;
            loadNextDays();
            setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
        } else if (scrollLeft <= 10) {
            // 스크롤이 왼쪽 끝에 가까워지면 이전 날짜 로드
            isLoading = true;
            loadPreviousDays();
            setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
        }
    }

    document
        .getElementById("calendar-container")
        .addEventListener("scroll", handleScroll);

    // 초기화
    generateCalendar(currentDate);

    // 현재 시간 표시 함수
    function displayCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const currentTimeString = `${hours}:${minutes}`;
        document.getElementById("bp-current-time").textContent =
            currentTimeString;

        record_time = `${hours}:${minutes}:00`;
    }

    // 현재 시간 표시 초기 호출
    displayCurrentTime();
});

document.getElementById("bp-save").addEventListener("click", () => {
    return Swal.fire({
        title: "기록 저장 성공",
        text: "혈압 기록이 저장되었습니다.",
        icon: "success",
    });
});

//post 설정
const url = "/api/blood-pressure-logs";
let blood_pressure_min_value = document.getElementById(
    "bloodpressurelog_detail_input_min"
).value;
let blood_pressure_max_value = document.getElementById(
    "bloodpressurelog_detail_input_max"
).value;
let bpUserData = {
    blood_pressure_max: blood_pressure_max_value,
    blood_pressure_min: blood_pressure_min_value,
};
function bpClick(event) {
    event.preventDefault();
    if (
        blood_pressure_min_value === null ||
        blood_pressure_min_value === undefined
    ) {
        Swal.fire({
            icon: "error",
            title: "이완기 혈압을 입력해주세요",
        });
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    } else if (
        blood_pressure_max_value === null ||
        blood_pressure_max_value === undefined
    ) {
        Swal.fire({
            icon: "error",
            title: "수축기 혈압을 입력해주세요",
        });
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }
    bpPostData(url, bpUserData);
}

//post 함수

async function bpPostData(url, bpUserData) {
    try {
        const response = await axios.post(url, bpUserData, {
            withCredentials: true,
        });
        console.log("Success:", response.bpUserData);
    } catch (error) {
        console.log("Error:", error);
    }
}
