// 달력js
$(document).ready(function () {
    $(".selLabel").on("touchstart", function () {
        $(".dropdown").toggleClass("active");
    });

    $(".dropdown-list li").on("touchstart", function () {
        $(".selLabel").text($(this).text());
        $(".dropdown").removeClass("active");
        $(".selected-item p span").text($(".selLabel").text());
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const createOptions = (min, max, step) => {
        let options = "";
        for (let i = min; i <= max; i += step) {
            options += `<div data-value="${i}">${i}</div>`;
        }
        return options;
    };
});

// 기록생성버튼js
$(document).ready(function () {
    let toggleState = false;
    let originalButtonPosition = { bottom: "70px", right: "20px" };
    let $mainToggleButton = $("#main-toggle-button");
    let $menuButtons = $("#menu-buttons");
    let $recordsContainer = $("#records-container");
    let $recordButtons = $(
        "#exercise-button, #weight-record-button, #blood-pressure-button, #meal-sugar-button, #sugar-button"
    );
    let lastClickedButton = null;

    $recordButtons.prop("disabled", true);

    $mainToggleButton.click(function () {
        toggleState = !toggleState;
        $(this).toggleClass("rotate");

        if (toggleState) {
            $menuButtons.removeClass("hidden");
            $(".floating-button-container").addClass("show");
            $(".floating-button-text").show();
            $recordButtons.prop("disabled", false);
        } else {
            $(".floating-button-container").removeClass("show");
            $(".floating-button-text").hide();
            setTimeout(function () {
                $menuButtons.addClass("hidden");
                $recordButtons.prop("disabled", true);
                $recordsContainer.css("max-height", "calc(100vh - 100px)");
            }, 300);
        }
    });

    $("#exercise-button").click(function () {
        lastClickedButton = $(this);
        addRecord(
            "운동 기록",
            "https://res.cloudinary.com/difzc7bsf/image/upload/v1721719663/002_cuhgi9.png"
        );
        triggerMainToggleButton("");
    });

    $("#weight-record-button").click(function () {
        lastClickedButton = $(this);
        addRecord(
            "체중 기록",
            "https://res.cloudinary.com/difzc7bsf/image/upload/v1721888337/image-removebg-preview_3_t28f17.png"
        );
        triggerMainToggleButton();
    });

    $("#blood-pressure-button").click(function () {
        lastClickedButton = $(this);
        addRecord(
            "혈압 기록",
            "https://res.cloudinary.com/difzc7bsf/image/upload/v1721983336/%EC%A0%9C%EB%AA%A9%EC%9D%84-%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94_-009_basbm8.png"
        );
        triggerMainToggleButton();
    });

    $("#meal-sugar-button").click(function () {
        lastClickedButton = $(this);
        addRecord(
            "식사 기록",
            "https://res.cloudinary.com/difzc7bsf/image/upload/v1721885477/%EC%A0%9C%EB%AA%A9%EC%9D%84_%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94_-005_tvsy8t.png"
        );
        triggerMainToggleButton();
    });

    $("#sugar-button").click(function () {
        lastClickedButton = $(this);
        addRecord(
            "혈당 기록",
            "https://res.cloudinary.com/difzc7bsf/image/upload/v1721719247/blood_h0b2io.png"
        );
        triggerMainToggleButton();
    });

    function addRecord(recordType, imgUrl) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const timeString = `${hours}:${minutes}`;
        const valueString = "90mg/dl";

        const recordHtml = `
            <div class="record-entry">
                <div class="record-title">
                    <img src="${imgUrl}" alt="" style="width: 24px; height: 24px; margin-right: 8px;">
                    <div id="record-title-text">${recordType}</div>
                </div>
                <div class="record-time">${timeString}</div>
                <i class="fas fa-times close-icon" onclick="removeRecord(this)" style="cursor: pointer;"></i>
                <div class="record-value">${valueString}</div>
            </div>
        `;

        $recordsContainer.append(recordHtml);
        $recordsContainer.scrollTop($recordsContainer[0].scrollHeight);

        if (lastClickedButton) {
            lastClickedButton.css({
                bottom: originalButtonPosition.bottom,
                right: originalButtonPosition.right,
            });
            lastClickedButton = null;
        }
        $mainToggleButton.css({
            bottom: originalButtonPosition.bottom,
            right: originalButtonPosition.right,
        });
    }

    window.removeRecord = function (element) {
        $(element).parent().remove();
        $recordsContainer.scrollTop($recordsContainer[0].scrollHeight);
    };

    function triggerMainToggleButton() {
        $mainToggleButton.trigger("click");
    }
});

// 이게 어느정도 생성되면 범위가 생기는 방식
// function adjustRecordsContainerHeight() {
//     const buttonOffset = $('#exercise-button').offset().top;
//     const containerOffset = $('#records-container').offset().top;
//     const containerHeight = $(window).height() - (buttonOffset - containerOffset) + 20;

//     $recordsContainer.css('max-height', containerHeight + 'px');
// }

// + 버튼을 다시 클릭하는 함수

// 캘린더

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
        dayDiv.innerHTML = `${date.getDate()}<br>${daysOfWeek[date.getDay()]}`;
        dayDiv.addEventListener("click", () => {
            generateCalendar(date); // 새로운 날짜 생성
            updateHeader(date); // 헤더 업데이트
            // 추가적인 기능이 필요한 경우 여기에 추가합니다.
        });
        calendar.appendChild(dayDiv);
    }
    updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
    console.log("Month:", selectedDate.getMonth() + 1); // 0부터 시작하므로 +1
    console.log("Day:", selectedDate.getDate());
}

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", (event) => {
    const dateParam = getParameterByName("date");
    if (dateParam) {
        currentDate = new Date(dateParam);
    }
    generateCalendar(currentDate); // 초기화
});
