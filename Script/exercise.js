const selectElement = document.getElementById('exercise');
const selectedValue = selectElement.value;
let record_date = "";
let record_time = "";

document.getElementById('bs-submit').addEventListener('click', async () => {
    // document.getElementById('my-select');
    // const selectedValue = selectElement.value; // 여기서 선택된 값을 가져옵니다.
    try {
        const response = await axios.post('/api/exercise-logs', {
            exercise_type: document.getElementById("exercise").value,
            exercise_time: document.getElementById("duration").value,
            calories_burned: document.getElementById("result").textContent.split(" ")[3] || 0, // 소모 칼로리 값 가져오기
            record_time: `${record_date} ${record_time}`,
        });
        const exercise = response.data.data; // API 응답에서 운동 데이터를 가져옴
        console.log('exercise success:', exercise); // 수정된 부분
    } catch (error) {
        console.error('exercise error:', error); // 에러 로그를 콘솔에 출력
        // 2024-07-24 09:00:00
    }
});

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
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
        document.getElementById("current-time").textContent = currentTimeString;

        record_time = `${hours}:${minutes}:00`
    }

    // 현재 시간 표시 초기 호출
    displayCurrentTime();

    // 운동 선택 창
    const exerciseCalories = {
        걷기: 3.5,
        달리기: 9.8,
        자전거: 7.0,
        수영: 8.0,
        줄넘기: 12.0,
        계단오르기: 8.5,
        에어로빅: 6.0,
        근력운동: 4.5,
        요가: 4.0,
        필라테스: 5.0,
        테니스: 7.5,
        축구: 7.0,
        농구: 8.0,
        배드민턴: 6.0,
        볼링: 2.5,
        댄스: 7.0,
        탁구: 4.5,
        하이킹: 6.5,
        크로스핏: 9.5,
        체조: 5.5,
        스쿼시: 9.0,
        복싱: 10.0,
        자유웨이트: 6.0,
        사이클링: 8.0,
        롤러블레이딩: 7.0,
        킥복싱: 9.0,
        하키: 8.0,
        스키: 7.5,
        스노우보드: 6.5,
        서핑: 7.0,
        스쿼트: 5.0,
        유산소운동: 6.5,
        전신운동: 8.5,
    };

    // 시간 입력시 자동으로 소모 칼로리 계산
    function calculateCalories() {
        const exercise = document.getElementById("exercise").value;
        const duration = parseFloat(document.getElementById("duration").value);

        if (!exercise || isNaN(duration) || duration <= 0) {
            alert("운동 종류와 시간을 정확히 입력해 주세요.");
            return;
        }

        const caloriesPerMinute = exerciseCalories[exercise];
        const totalCalories = caloriesPerMinute * duration;

        document.getElementById(
            "result"
        ).innerText = `소모 칼로리 : ${totalCalories.toFixed(2)} kcal`;
    }

    window.calculateCalories = calculateCalories;
});
