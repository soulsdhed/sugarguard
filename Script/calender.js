document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const calendarHeader = document.getElementById("calendar-header");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let currentDate = new Date(); // 현재 날짜로 초기화
  let selectedDate = currentDate; // 선택된 날짜로 초기화

  function updateHeader(date) {
    const options = { year: "numeric", month: "long" };
    calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
  }

  function generateCalendar(date) {
    calendar.innerHTML = ""; // 기존 캘린더 내용 제거

    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      if (currentDate.toDateString() === date.toDateString()) {
        dayDiv.classList.add("selected");
      }
      dayDiv.innerHTML = `${currentDate.getDate()}<br>${
        daysOfWeek[currentDate.getDay()]
      }`;
      dayDiv.addEventListener("click", () => {
        generateCalendar(currentDate); // 새로운 날짜 생성
        updateHeader(currentDate); // 헤더 업데이트
        selectedDate = currentDate; // 선택된 날짜 업데이트
      });
      calendar.appendChild(dayDiv);
    }
    // updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
    // console.log("Month:", selectedDate.getMonth() + 1); // 0부터 시작하므로 +1
    // console.log("Day:", selectedDate.getDate());

    updateHeader(date); // 선택된 날짜로 헤더 업데이트
    // console.log("Month:", date.getMonth() + 1); // 0부터 시작하므로 +1
    // console.log("Day:", date.getDate());
    updateChart(); // 차트 업데이트 함수 호출
  }

  function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  const dateParam = getParameterByName("date");
  if (dateParam) {
    selectedDate = new Date(dateParam);
  }
  generateCalendar(selectedDate); // 초기화

  // div 링크
  document.querySelectorAll(".LinkRecipe").forEach((div) => {
    div.addEventListener("click", function () {
      window.location.href = this.getAttribute("data-href");
    });
  });
  document
    .querySelectorAll(".LinkDiabetes, .LinkExercise, .LinkMeal")
    .forEach((div) => {
      div.addEventListener("click", function () {
        const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
        window.location.href = `${this.getAttribute(
          "data-href"
        )}?date=${formattedDate}`;
      });
    });
});

// .day 요소에 클릭 이벤트 추가
document.querySelectorAll(".day").forEach((element) => {
  element.addEventListener("click", () => {
    updateChart(); // 차트 업데이트 함수 호출
  });
});
