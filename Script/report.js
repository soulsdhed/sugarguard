const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// 날짜를 "MM-DD(요일)" 형식으로 변환하는 함수
const formatDateWithDay = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${month}-${day}(${dayOfWeek})`;
};

document.addEventListener("DOMContentLoaded", async function () {
    // Navigation line animation
    let nav = document.querySelector("nav");
    let line = document.createElement("div");
    line.classList.add("line");

    nav.appendChild(line);

    let active = nav.querySelector(".active");
    let pos = 0;
    let wid = 0;

    if (active) {
        pos = active.offsetLeft;
        wid = active.offsetWidth;
        line.style.left = pos + "px";
        line.style.width = wid + "px";
    }

    nav.querySelectorAll("ul li a").forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            let parent = anchor.parentElement;
            if (
                !parent.classList.contains("active") &&
                !nav.classList.contains("animate")
            ) {
                nav.classList.add("animate");

                let position = parent.offsetLeft;
                let width = parent.offsetWidth;

                nav.querySelectorAll("ul li").forEach(function (li) {
                    li.classList.remove("active");
                });

                if (position >= pos) {
                    line.style.transition = "width 0.3s";
                    line.style.width = position - pos + width + "px";
                    setTimeout(function () {
                        line.style.transition = "width 0.15s, left 0.15s";
                        line.style.width = width + "px";
                        line.style.left = position + "px";
                        setTimeout(function () {
                            nav.classList.remove("animate");
                        }, 150);
                        parent.classList.add("active");
                    }, 300);
                } else {
                    line.style.transition = "left 0.3s";
                    line.style.left = position + "px";
                    setTimeout(function () {
                        line.style.transition = "width 0.15s";
                        line.style.width = pos - position + wid + "px";
                        setTimeout(function () {
                            line.style.width = width + "px";
                            nav.classList.remove("animate");
                        }, 150);
                        parent.classList.add("active");
                    }, 300);
                }

                pos = position;
                wid = width;
            }
        });
    });

    // 데이터 받아오기
    const queryString = window.location.pathname;
    console.log(queryString);

    // 시작일과 종료일 만들기
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);
    let startDate = formatDate(oneWeekAgo);
    let endDate = formatDate(today);

    console.log(startDate, endDate);

    // 시작일과 종료일을 기준으로 라벨 제작
    const labels = [];
    for (
        let date = new Date(oneWeekAgo);
        date <= today;
        date.setDate(date.getDate() + 1)
    ) {
        labels.push(formatDateWithDay(date));
    }
    console.log(labels);

    // 시작일과 종료일을 기준으로 데이터 제작
    const chartData = [];

    let barColor = "rgba(0, 0, 255, 1.0)";
    let stepSize = 10;
    // 쿼리에 따라 데이터 분기
    if (queryString === "/report/blood-sugar") {
        // 선 간격 조절
        stepSize = 10;
        // 색상 설정
        barColor = "rgba(215, 32, 0, 1.0)";

        // TODO : 날짜 표시 및 전체 값 평균 등의 데이터 표시

        try {
            const response = await axios.get("/api/chart/blood-sugar", {
                params: {
                    period: "day",
                    startDate: startDate,
                    endDate: endDate,
                },
                withCredentials: true,
            });
            console.log(response.data.data);
            console.log(oneWeekAgo);
            console.log(today);

            console.log(response.data.data.chartData);
            console.log(response.data.data.chartData[0]);
            // 데이터 제작
            for (
                let date = oneWeekAgo;
                date <= today;
                date.setDate(date.getDate() + 1)
            ) {
                // 해당 날짜에 맞는 데이터 찾기
                const entry = response.data.data.chartData.find(
                    (item) => item.period == date.toISOString().split("T")[0]
                );
                console.log(entry);

                chartData.push(
                    entry ? entry.average_blood_sugar_per_entry : null
                );
            }
        } catch (e) {
            console.log(e);
        }
    }
    console.log(chartData);

    // Chart
    var ctx = document.getElementById("Chart").getContext("2d");

    // 플러그인 추가: 막대 상단 둥글게 만들기
    Chart.defaults.elements.bar.borderSkipped = false;
    Chart.defaults.elements.bar.borderRadius = {
        topLeft: 20,
        topRight: 20,
        bottomLeft: 0,
        bottomRight: 0,
    };

    var chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "",
                    data: chartData,
                    backgroundColor: barColor,
                    borderColor: "rgba(0, 0, 255, 0.0)", // 투명한 테두리로 설정
                    borderWidth: 0, // 테두리 너비를 0으로 설정
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        display: false, // 세로 실선을 제거
                    },
                },
                y: {
                    beginAtZero: true,
                    position: "right", // y축 레이블을 오른쪽에 배치
                    ticks: {
                        stepSize: stepSize, // 200 단위로 눈금 설정
                        // max: 1000, // 최대값을 1000으로 설정
                    },
                    grid: {
                        display: true, // y축 실선은 유지
                    },
                },
            },
            plugins: {
                legend: {
                    display: false, // 범례를 숨김
                },
                title: {
                    display: false, // 타이틀을 숨김
                },
                tooltip: {
                    enabled: false, // 툴팁을 비활성화
                },
            },
            animation: {
                duration: 1500,
                easing: "easeInOutQuart",
            },
        },
    });
});
