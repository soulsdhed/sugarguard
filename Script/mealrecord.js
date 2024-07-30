let formattedTime, formattedDate;
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
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
        formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

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
    // function displayCurrentTime() {
    //     const now = new Date();
    //     const hours = String(now.getHours()).padStart(2, "0");
    //     const minutes = String(now.getMinutes()).padStart(2, "0");
    //     const currentTimeString = `${hours}:${minutes}`;
    //     document.getElementById("current-time").textContent = currentTimeString;

    //     record_time = `${hours}:${minutes}:00`;
    // }
    // displayCurrentTime();

    // // 현재 시간 표시 초기 호출
    const now = new Date();
    // 왼쪽 시간나타내는거
    window.addEventListener("DOMContentLoaded", (event) => {
        // 날짜와 시간을 포맷에 맞게 설정
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        // 날짜와 시간 입력 필드에 설정
        document.getElementById("time").value = `${hours}:${minutes}`;
        formattedTime = `${hours}:${minutes}:${seconds}`;

        // 선택하고 저장 버튼을 누를 때 기록목록에 기록이 남기는 곳
        document
            .getElementById("mealrecord-button")
            .addEventListener("click", async function () {
                const mealType =
                    document.querySelector("#time-meal a.active")
                        ?.textContent || "선택되지 않음";
                const mealInfo =
                    document.getElementById("meal-information").value;
                const medicineInfo = document.querySelector(
                    "#medicine-information input"
                ).value;
                const specialInfo = document.getElementById(
                    "special-information"
                ).value;

                if (!mealInfo) {
                    alert("식사 정보를 입력해 주세요.");
                    return;
                }

                // 콘솔에 기록 남기기
                console.log(
                    `기록:${recordDateTime1} ${mealType.trim()} 식사 정보:${mealInfo}
                약정보:${medicineInfo} 특이사항:${specialInfo}`
                );

                const recordItem = document.createElement("li");
                recordItem.textContent = `${recordDateTime1} ${mealType}식사 정보:${mealInfo} 약정보:${medicineInfo} 특이사항:${specialInfo}`;

                // 입력 필드 초기화
                document.getElementById("meal-information").value = "";
                document.querySelector("#medicine-information input").value =
                    "";
                document
                    .querySelectorAll("#time-meal a")
                    .forEach((a) => a.classList.remove("active"));
                var recordDateTime1 = formattedDate +" "+ formattedTime;
                console.log(recordDateTime1);

                // API POST
                async function postData() {
                    // toISOString().slice(0, 19).replace("T", " ");
                    console.log(recordDateTime1);
                    try {
                        const response = await axios.post("/api/meal-logs", {
                            record_date: recordDateTime1,
                            meal_time: mealType.trim(),
                            medication: medicineInfo,
                            meal_info: mealInfo,
                            comments: specialInfo,
                            //     // ml_id: "",
                            //     // member_id: "",
                            //     // calories: "",
                        });
                        console.log(response.data);
                    } catch (err) {
                        console.error(`ErrorMessage :${err}`);
                    }
                }

                await postData();
            });
    });

    // 식사버튼을 누를때 표시되는 곳
    document.querySelectorAll("#time-meal a").forEach((a) => {
        a.addEventListener("click", function () {
            document
                .querySelectorAll("#time-meal a")
                .forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // 식사버튼을 누를때 색깔 변하는거
    document.querySelectorAll("#time-meal a").forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault(); // 링크 클릭 기본 동작 방지
            anchor.classList.toggle("clicked"); // 'active' 클래스 토글
        });
    });

    // Edit date and time buttons
    // document
    //     .getElementById("edit-date-button")
    //     .addEventListener("click", () => editDateTime("date"));
    // document
    //     .getElementById("edit-time-button")
    //     .addEventListener("click", () => editDateTime("time"));

    // Update from input fields
    // document
    //     .getElementById("dateInput")
    //     .addEventListener("change", () => updateFromInput("date"));
    // document
    //     .getElementById("timeInput")
    //     .addEventListener("change", () => updateFromInput("time"));

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});
