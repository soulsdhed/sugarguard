document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const calendarHeader = document.getElementById("calendar-header");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let currentDate = new Date(); // 현재 날짜로 초기화

    function updateHeader(date) {
        const options = { year: 'numeric', month: 'long' };
        calendarHeader.textContent = date.toLocaleDateString('ko-KR', options);
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
            dayDiv.innerHTML = `${date.getDate()}<br>${daysOfWeek[date.getDay()]}`;
            dayDiv.addEventListener("click", () => {
                generateCalendar(date); // 새로운 날짜 생성
                updateHeader(date); // 헤더 업데이트
            });
            calendar.appendChild(dayDiv);
        }
        updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
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
});


// 현재 시간 표시 함수
function displayCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}`;
    document.getElementById('current-time').textContent = currentTimeString;
}

// 현재 시간 표시 초기 호출
displayCurrentTime();




  
  // 운동 별 일반적인 1시간당 칼로리 소모량 (kg 당 칼로리)
  const exerciseCalories = {
    '걷기': 3.5,
    '조깅': 7.0,
    '수영(경쟁)': 10.0,
    '수영(레저)': 6.0,
    '자전거 타기(보통)': 7.5,
    '자전거 타기(고속)': 10.0,
    '골프(보통)': 4.5,
    '골프(카트 타기)': 2.5,
    '테니스': 7.0,
    '배드민턴': 5.5,
    '스쿼시': 9.0,
    '야구': 5.5,
    '축구': 7.0,
    '농구': 6.0,
    '볼링': 3.0,
    '줄넘기': 12.0,
    '계단 오르내리기': 8.0,
    '체조(경륜)': 8.0,
    '스트레칭': 2.5,
    '요가': 3.0,
    '필라테스': 3.5,
    '중량 훈련(보통)': 5.0,
    '중량 훈련(강도 높음)': 7.0,
    '줄다리기': 10.0,
    '헬스 머신(런닝 머신, 엘리프티컬 등)': 7.0,
    '체육 수업(보통)': 6.0,
    '댄스(고강도)': 8.0,
    '댄스(저강도)': 4.5,
    '체육 수업(고강도)': 8.0,
    '댄스(집에서)': 4.0
  };

  // 운동별 칼로리 소모 계산 함수
  function calculateCalories(exercise, duration) {
    if (exercise in exerciseCalories) {
      const caloriesPerHour = exerciseCalories[exercise];
      const caloriesBurned = (caloriesPerHour * duration) / 60;
      return caloriesBurned.toFixed(2);  // 소수점 2자리까지 표시
    } else {
      return '운동을 찾을 수 없습니다.';
    }
  }

  // 폼 제출 이벤트 처리
  const form = document.getElementById('calorieForm');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const exercise = document.getElementById('exerciseSelect').value;
    // const weight = document.getElementById('weightInput').value;
    const duration = document.getElementById('durationInput').value;

    const burnedCalories = calculateCalories(exercise,duration);

    // 결과를 HTML에 표시
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `<p>${duration}분 동안 ${exercise}을(를) 하면 약 <strong>${burnedCalories}kcal</strong> 소모됩니다.</p>`;
  });