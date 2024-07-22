document.addEventListener("DOMContentLoaded", function () {
    const labels = ["0", "9", "13", "20"];
    const data = {
        labels: labels,
        datasets: [
            {
                label: "", // 범례를 표시하지 않기 위해 빈 문자열
                data: [0, 13, 23, 31],
                borderColor: "orange", // 파스텔 옐로우
                backgroundColor: "orange", // 파스텔 옐로우
                borderWidth: 2,
                tension: 0.4, // 곡선을 둥글게 만듦
                fill: false, // 채우기를 비활성화
                pointRadius: 1, // 데이터 포인트의 반지름
                pointBackgroundColor: "orange", // 데이터 포인트 색상 파스텔 옐로우
                pointBorderColor: "orange", // 데이터 포인트 테두리 색상 파스텔 옐로우
            },
        ],
    };

    const config = {
        type: "line",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false, // 비율 설정을 해제
            plugins: {
                legend: {
                    display: false, // 범례를 표시하지 않음
                },
                title: {
                    display: false, // 타이틀을 표시하지 않음
                },
            },
            scales: {
                x: {
                    ticks: {
                        display: false, // X축 눈금을 표시하지 않음
                    },
                    grid: {
                        display: false, // X축 그리드를 표시하지 않음
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false, // Y축 제목을 표시하지 않음
                    },
                    ticks: {
                        color: "#333333", // Y축 눈금 색상 짙은 회색
                        font: {
                            weight: "bold", // Y축 눈금 글꼴을 진하게
                        },
                    },
                    grid: {
                        color: "rgba(200, 200, 200, 0.2)", // Y축 그리드 색상
                    },
                },
            },
        },
    };

    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, config);
});
