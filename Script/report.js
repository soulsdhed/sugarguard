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

let chart;
const drawChart = async (period, first) => {
    // 데이터 받아오기
    const queryString = window.location.pathname;
    console.log(queryString);
    console.log(period);

    // 시작일과 종료일 만들기
    let startDate;
    let endDate;
    if (period === "WEEK") {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 6);
        startDate = formatDate(oneWeekAgo);
        endDate = formatDate(today);
    } else if (period === 'MONTH') {
        const today = new Date();
        startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    }

    console.log(startDate, endDate);

    // 시작일과 종료일을 기준으로 라벨 제작
    const labels = [];
    for (
        let date = new Date(startDate);
        date <= new Date(endDate);
        date.setDate(date.getDate() + 1)
    ) {
        labels.push(formatDateWithDay(date));
    }
    console.log(labels);

    // 시작일과 종료일을 기준으로 데이터 제작
    let datasets = [];

    let barColor = "rgba(0, 0, 255, 1.0)";
    let stepSize = 10;
    let title = "분석 차트"
    let unit = "mg/dl"
    let average = "0";

    // 쿼리에 따라 데이터 분기
    if (queryString === "/report/blood-sugar") {
        // 선 간격 조절
        stepSize = 10;
        // 색상 설정
        barColor = "rgba(215, 32, 0, 1.0)";
        // 제목
        title = "혈당 분석 차트"
        // 단위
        unit = "mg/dl"

        try {
            const response = await axios.get("/api/chart/blood-sugar", {
                params: {
                    period: "day",
                    startDate: startDate,
                    endDate: endDate,
                },
                withCredentials: true,
            });

            // 데이터 제작
            const chartData = [];
            for (
                let date = new Date(startDate);
                date <= new Date(endDate);
                date.setDate(date.getDate() + 1)
            ) {
                // 해당 날짜에 맞는 데이터 찾기
                const entry = response.data.data.chartData.find(
                    (item) => item.period == date.toISOString().split("T")[0]
                );

                chartData.push(
                    entry ? entry.average_blood_sugar_per_entry : null
                );
            }
            // 데이터셋 제작
            datasets = [
                {
                    label: "",
                    data: chartData,
                    backgroundColor: barColor,
                    borderColor: "rgba(0, 0, 255, 0.0)",
                    borderWidth: 0,
                },
            ];
            average = chartData.filter(x => x !== null).reduce((a, b, _, { length }) => a + b / length, 0).toFixed(2).toString();
        } catch (e) {
            console.log(e);
        }
    } else if (queryString === "/report/exercise") {
        // 선 간격 조절
        stepSize = 200;
        // 색상 설정
        barColor = "rgba(0, 52, 185, 1.0)";
        // 제목
        title = "운동량 분석 차트"
        // 단위
        unit = "kcal"

        try {
            const response = await axios.get("/api/chart/exercise", {
                params: {
                    period: "day",
                    startDate: startDate,
                    endDate: endDate,
                },
                withCredentials: true,
            });

            // 데이터 제작
            const chartData = [];
            for (
                let date = new Date(startDate);
                date <= new Date(endDate);
                date.setDate(date.getDate() + 1)
            ) {
                // 해당 날짜에 맞는 데이터 찾기
                const entry = response.data.data.chartData.find(
                    (item) => item.period == date.toISOString().split("T")[0]
                );

                chartData.push(
                    entry ? entry.average_calories_per_day : null
                );
            }
            // 데이터셋 제작
            datasets = [
                {
                    label: "",
                    data: chartData,
                    backgroundColor: barColor,
                    borderColor: "rgba(0, 0, 255, 0.0)",
                    borderWidth: 0,
                },
            ];
            average = chartData.filter(x => x !== null).reduce((a, b, _, { length }) => a + b / length, 0).toFixed(2).toString();
        } catch (e) {
            console.log(e);
        }
    } else if (queryString === "/report/meal") {
        // 선 간격 조절
        stepSize = 200;
        // 색상 설정
        barColor = "rgba(255, 205, 74, 1.0)";
        // 제목
        title = "식사 칼로리 분석 차트"
        // 단위
        unit = "kcal"

        try {
            const response = await axios.get("/api/chart/meal", {
                params: {
                    period: "day",
                    startDate: startDate,
                    endDate: endDate,
                },
                withCredentials: true,
            });

            // 데이터 제작
            const chartData = [];
            for (
                let date = new Date(startDate);
                date <= new Date(endDate);
                date.setDate(date.getDate() + 1)
            ) {
                // 해당 날짜에 맞는 데이터 찾기
                const entry = response.data.data.chartData.find(
                    (item) => item.period == date.toISOString().split("T")[0]
                );

                chartData.push(
                    entry ? entry.average_calories_per_day : null
                );
            }
            // 데이터셋 제작
            datasets = [
                {
                    label: "",
                    data: chartData,
                    backgroundColor: barColor,
                    borderColor: "rgba(0, 0, 255, 0.0)",
                    borderWidth: 0,
                },
            ];
            average = chartData.filter(x => x !== null).reduce((a, b, _, { length }) => a + b / length, 0).toFixed(2).toString();
        } catch (e) {
            console.log(e);
        }
    } else if (queryString === "/report/weight") {
        // 선 간격 조절
        stepSize = 20;
        // 색상 설정
        barColor = "#833ee0";
        // 제목
        title = "체중 분석 차트"
        // 단위
        unit = "kg"

        try {
            const response = await axios.get("/api/chart/weight", {
                params: {
                    period: "day",
                    startDate: startDate,
                    endDate: endDate,
                },
                withCredentials: true,
            });

            // 데이터 제작
            const chartData = [];
            for (
                let date = new Date(startDate);
                date <= new Date(endDate);
                date.setDate(date.getDate() + 1)
            ) {
                // 해당 날짜에 맞는 데이터 찾기
                const entry = response.data.data.chartData.find(
                    (item) => item.period == date.toISOString().split("T")[0]
                );

                chartData.push(
                    entry ? entry.average_weight_per_entry : null
                );
            }
            // 데이터셋 제작
            datasets = [
                {
                    label: "",
                    data: chartData,
                    backgroundColor: barColor,
                    borderColor: "rgba(0, 0, 255, 0.0)",
                    borderWidth: 0,
                },
            ];
            average = chartData.filter(x => x !== null).reduce((a, b, _, { length }) => a + b / length, 0).toFixed(2).toString();
        } catch (e) {
            console.log(e);
        }
    } else if (queryString === "/report/blood-pressure") {
        // 선 간격 조절
        stepSize = 20;
        // 색상 설정
        barColor = "#833ee0";
        // 제목
        title = "혈압 분석 차트"
        // 단위
        unit = "mmHg"

        try {
            const response = await axios.get("/api/chart/blood-pressure", {
                params: {
                    period: "day",
                    startDate: startDate,
                    endDate: endDate,
                },
                withCredentials: true,
            });

            // 데이터 제작
            const chartDataLow = [];
            const chartDataHigh = [];
            for (
                let date = new Date(startDate);
                date <= new Date(endDate);
                date.setDate(date.getDate() + 1)
            ) {
                // 해당 날짜에 맞는 데이터 찾기
                const entry = response.data.data.chartData.find(
                    (item) => item.period == date.toISOString().split("T")[0]
                );

                chartDataLow.push(
                    entry ? entry.average_blood_pressure_min_per_entry : null
                );
                chartDataHigh.push(
                    entry ? entry.average_blood_pressure_max_per_entry : null
                );
            }
            // 데이터셋 제작
            datasets = [
                {
                    label: "",
                    data: chartDataLow,
                    backgroundColor: "rgba(225, 32, 10, 1.0)",
                    borderColor: "rgba(0, 0, 255, 0.0)",
                    borderWidth: 0,
                },
                {
                    label: "",
                    data: chartDataHigh,
                    backgroundColor: "#FF7000",
                    borderColor: "rgba(0, 0, 255, 0.0)",
                    borderWidth: 0,
                },
            ];
            average = `${chartDataLow.filter(x => x !== null).reduce((a, b, _, { length }) => a + b / length, 0).toFixed(0).toString()} ~ ${chartDataHigh.filter(x => x !== null).reduce((a, b, _, { length }) => a + b / length, 0).toFixed(0).toString()}`;
        } catch (e) {
            console.log(e);
        }
    }

    // Title
    document.getElementById("report-title").textContent = title;
    // 날짜
    document.getElementById("content-result1").textContent = `${startDate} ~ ${endDate}`
    // 평균값
    document.getElementById("content-result2").textContent = average;
    // 단위
    document.getElementById("content-result3").textContent = unit;

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


    if (first) {
        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: datasets,
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
                        // maxTicksLimit: 5,
                        // autoSkip: false, // 자동 생략을 비활성화합니다.
                        // maxRotation: 0,  // 라벨 회전을 비활성화합니다.
                        // minRotation: 0
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
    } else {
        chart.data = {
            labels: labels,
            datasets: datasets,
        };
        chart.update();
    }

    // 로딩화면 제거
    document.getElementById('loading-screen').style.display = 'none';
}

let period = "WEEK";
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
        anchor.addEventListener("click", async function (e) {
            e.preventDefault();
            let parent = anchor.parentElement;
            console.log(parent.textContent);

            // 차트 다시 그리기
            if (period != parent.textContent) {
                period = parent.textContent
                await drawChart(period, false);
            }

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

    await drawChart("WEEK", true);
});
