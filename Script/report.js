document.addEventListener("DOMContentLoaded", function () {
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

    // Chart
    var ctx = document.getElementById("Chart").getContext("2d");

    // 플러그인 추가: 막대 상단 둥글게 만들기
    Chart.defaults.elements.bar.borderSkipped = false;
    Chart.defaults.elements.bar.borderRadius = {
        topLeft: 10,
        topRight: 10,
        bottomLeft: 0,
        bottomRight: 0,
    };

    var chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1", "2", "3", "4", "5", "6", "7"],
            datasets: [
                {
                    label: "",
                    data: [200, 400, 600, 800, 100, 500, 700],
                    backgroundColor: "black",
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
                        stepSize: 200, // 200 단위로 눈금 설정
                        max: 1000, // 최대값을 1000으로 설정
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
