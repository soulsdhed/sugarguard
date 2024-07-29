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
document
        .getElementById("dateInput")
        .addEventListener("change", () => updateFromInput("date"));
    document
        .getElementById("timeInput")
        .addEventListener("change", () => updateFromInput("time"));

});
