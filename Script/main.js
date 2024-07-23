document.addEventListener("DOMContentLoaded", () => {
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
    const caloriesBurned = [300, 430, 450, 740, 800, 1200, 2000];

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 0.4)");
    gradient.addColorStop(1, "rgba(75, 192, 192, 0)");

    const data = {
        labels: timeLabels,
        datasets: [
            {
                data: caloriesBurned,
                fill: true,
                backgroundColor: gradient,
                borderColor: "rgba(75, 192, 192, 1)",
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(75, 192, 192, 1)",
                tension: 0.4,
                pointRadius: 0, // 점을 보이지 않게 설정
            },
        ],
    };

    const config = {
        type: "line",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false, // y축 그리드 제거
                    },
                    ticks: {
                        display: false, // y축 눈금 숨기기
                    },
                    title: {
                        display: false, // y축 제목 숨기기
                    },
                },
                x: {
                    grid: {
                        display: false, // x축 그리드 제거
                    },
                    ticks: {
                        display: false, // x축 눈금 숨기기
                    },
                    title: {
                        display: false, // x축 제목 숨기기
                    },
                },
            },
            plugins: {
                legend: {
                    display: false, // 범례 숨기기
                },
                tooltip: {
                    enabled: false, // 툴팁 비활성화
                },
            },
            interaction: {
                intersect: false,
                mode: "index",
            },
            elements: {
                point: {
                    radius: 0, // 점을 보이지 않게 설정
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

    new Chart(ctx, config);
});
