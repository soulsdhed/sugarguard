document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calendarYear = document.getElementById("calendar-year");
    const calendarMonth = document.getElementById("calendar-month");

    function generateCalendar(selectedDate) {
        calendar.innerHTML = "";
        const startDate = new Date(selectedDate);
        startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

        // 년도와 월 업데이트
        calendarYear.innerText = selectedDate.getFullYear();
        calendarMonth.innerText = selectedDate.toLocaleString("default", {
            month: "long",
        });

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
            });
            calendar.appendChild(dayDiv);
        }
    }

    // 오늘 날짜로 초기화
    const today = new Date();
    generateCalendar(today);
});
