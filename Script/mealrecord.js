let currentDate = new Date();

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function updateDateTime() {
    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");
    const now = new Date();
    currentDate.setHours(now.getHours());
    currentDate.setMinutes(now.getMinutes());
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");
    const hours = currentDate.getHours();
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const formattedDate = `${year}년 ${month}월 ${date}일`;
    const formattedTime = `${period} ${hours % 12 || 12}:${minutes}`;
    dateElement.textContent = formattedDate;
    timeElement.textContent = formattedTime;
}

function editDateTime(type) {
    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");
    if (type === "date") {
        dateElement.style.display = "none";
        dateInput.style.display = "inline-block";
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const date = String(currentDate.getDate()).padStart(2, "0");
        dateInput.value = `${year}-${month}-${date}`;
        dateInput.focus();
    } else if (type === "time") {
        console.log("?");
        timeElement.style.display = "none";
        timeInput.style.display = "inline-block";
        console.log(currentDate);
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        console.log(hours);
        console.log(minutes);

        timeInput.value = `${hours}:${minutes}`;
        timeInput.focus();
    }
}

function updateFromInput(type) {
    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");
    if (type === "date") {
        const dateValue = dateInput.value;
        const [year, month, day] = dateValue.split("-");
        currentDate.setFullYear(year);
        currentDate.setMonth(month - 1);
        currentDate.setDate(day);
        dateElement.textContent = `${year}년 ${month}월 ${day}일`;
        dateElement.style.display = "inline-block";
        dateInput.style.display = "none";
    } else if (type === "time") {
        const timeValue = timeInput.value;
        const [hours, minutes] = timeValue.split(":");
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        const period = hours >= 12 ? "오후" : "오전";
        const formattedTime = `${period} ${hours % 12 || 12}:${minutes}`;
        console.log(formattedTime);
        timeElement.textContent = formattedTime;
        timeElement.style.display = "inline-block";
        timeInput.style.display = "none";
    }
    // updateDateTime(); // 변경된 날짜와 시간을 반영하여 업데이트
}

document.addEventListener("DOMContentLoaded", () => {
    let dateParam = getParameterByName("date");

    if (dateParam) {
        const [year, month, day] = dateParam.split("-");
        currentDate.setFullYear(year);
        currentDate.setMonth(month - 1);
        currentDate.setDate(day);
    }

    updateDateTime();
    // setInterval(updateDateTime, 60000); // 1분마다 업데이트

    // 선택하고 저장 버튼을 누를 때 기록목록에 기록이 남기는 곳
    document
        .getElementById("mealrecord-button")
        .addEventListener("click", function () {
            const dateElement = document.getElementById("date").textContent;
            const timeElement = document.getElementById("time").textContent;
            const mealType =
                document.querySelector("#time-meal a.active")?.textContent ||
                "선택되지 않음";
            const mealInfo = document.getElementById("meal-information").value;
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
                `기록:${dateElement} ${timeElement} ${mealType}:${mealInfo} 약정보:${medicineInfo} 특이사항:${specialInfo}`
            );

            const recordItem = document.createElement("li");
            recordItem.textContent = `${dateElement} ${timeElement} ${mealType}:${mealInfo} 약정보:${medicineInfo} 특이사항:${specialInfo}`;

            // 입력 필드 초기화
            document.getElementById("meal-information").value = "";
            document.querySelector("#medicine-information input").value = "";
            document
                .querySelectorAll("#time-meal a")
                .forEach((a) => a.classList.remove("active"));
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
    document
        .getElementById("dateInput")
        .addEventListener("change", () => updateFromInput("date"));
    document
        .getElementById("timeInput")
        .addEventListener("change", () => updateFromInput("time"));
});
