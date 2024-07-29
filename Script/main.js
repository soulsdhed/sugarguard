document.addEventListener("DOMContentLoaded", () => {
    let chart;

    const ctx = document.getElementById("mainChart2").getContext("2d");

    const timeLabels = [
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "24:00",
    ];

    // 랜덤한 값을 생성하는 함수
    function getRandomValues(numValues, min, max) {
        const values = [];
        for (let i = 0; i < numValues; i++) {
            values.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return values;
    }

    // const caloriesBurned1 = getRandomValues(7, 200, 2000);
    // const caloriesBurned2 = getRandomValues(7, 200, 2000);
    // const caloriesBurned3 = getRandomValues(7, 200, 2000);
    // const caloriesBurned4 = getRandomValues(7, 200, 2000);

    const generateData = () => {
        return {
            labels: timeLabels,
            datasets: [
                {
                    label: "Data 1",
                    data: getRandomValues(10, 200, 2000),
                    borderColor: "rgba(255, 99, 132, 1)", // 빨간색
                    backgroundColor: "rgba(255, 99, 132, 0.1)",
                    pointBackgroundColor: "rgba(255, 99, 132, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(255, 99, 132, 1)",
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true,
                },
                {
                    label: "Data 3",
                    data: getRandomValues(10, 50, 1500),
                    borderColor: "rgba(54, 102, 220, 1)", // 파란색
                    backgroundColor: "rgba(54, 102, 220, 0.1)",
                    pointBackgroundColor: "rgba(54, 162, 235, 1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(54, 162, 235, 1)",
                    tension: 0.4,
                    pointRadius: 0,
                    fill: true,
                },
            ],
        };
    };

    const config = {
        type: "line",
        data: generateData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                    },
                    ticks: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 0,
                    hoverBorderWidth: 0,
                },
            },
            animation: {
                duration: 1500,
                easing: "easeInOutQuart",
            },
        },
    };
    chart = new Chart(ctx, config);

    const calendar = document.getElementById("calendar");
    const calendarHeader = document.getElementById("calendar-header");
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let currentDate = new Date(); // 현재 날짜로 초기화

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
                chart.data = generateData();
                chart.update();
            });
            calendar.appendChild(dayDiv);
        }
        updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
        console.log("Month:", selectedDate.getMonth() + 1); // 0부터 시작하므로 +1
        console.log("Day:", selectedDate.getDate());
    }

    // 초기화
    generateCalendar(currentDate);
});
// div 링크
document.querySelectorAll(".LinkRecipe").forEach((div) => {
    div.addEventListener("touchstart", function () {
        window.location.href = this.getAttribute("data-href");
    });
});
document.querySelectorAll(".LinkDiabetes").forEach((div) => {
    div.addEventListener("touchstart", function () {
        window.location.href = this.getAttribute("data-href");
    });
});

document.querySelectorAll(".LinkExercise").forEach((div) => {
    div.addEventListener("touchstart", function () {
        window.location.href = this.getAttribute("data-href");
    });
});

document.querySelectorAll(".LinkMeal").forEach((div) => {
    div.addEventListener("touchstart", function () {
        window.location.href = this.getAttribute("data-href");
    });
});
