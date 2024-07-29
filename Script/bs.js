// 아침, 점심, 저녁 식전, 식후로 구별해서 저장 안 됨
// 취침 전도 저장 안 됨
// 공복, 실시간은 제대로 입력

const selectElement = document.getElementById('bs');
// const selectedValue = selectElement.value;
let record_date = "";
let record_time = "";

document.getElementById('bs-submit').addEventListener('click', async () => {
    const selectedValue = document.getElementById('my-select').value; // 선택된 값을 가져옵니다.
    
    // 혈당 값을 저장할 변수
    let bloodSugarValue;

    // 선택된 식사 유형에 따라 혈당 값 가져오기
    if (selectedValue === "아침" || selectedValue === "점심" || selectedValue === "저녁") {
        bloodSugarValue = document.getElementById("record-bs-after").value; // 식후 혈당
    } else {
        bloodSugarValue = document.getElementById("record-bs-before").value; // 식전 혈당
    }

    // 혈당 값이 유효한지 확인
    if (bloodSugarValue === "" || isNaN(bloodSugarValue)) {
        alert("혈당 값을 올바르게 입력하세요."); // 유효하지 않은 입력에 대한 경고
        return;
    }

    // 기록 시간을 위한 변수
    // const record_time = new Date().toLocaleTimeString(); // 현재 시간을 가져오는 방법
    // const record_date = new Date().toISOString().split('T')[0]; // 현재 날짜를 가져오는 방법

    try {
        const response = await axios.post('/api/blood-sugar-logs', {
            blood_sugar: bloodSugarValue, // 선택된 혈당 값
            record_type: selectedValue, // 선택된 식사 유형
            record_time: `${record_date} ${record_time}`, // 기록 시간
            comments: document.getElementById("eat-memo").value, // 추가 메모
        });

        const exercise = response.data.data; // API 응답에서 운동 데이터를 가져옴
        console.log('exercise success:', exercise); // 수정된 부분
        alert("혈당 기록이 저장되었습니다."); // 성공적으로 저장되었음을 알림
    } catch (error) {
        console.error('exercise error:', error); // 에러 로그를 콘솔에 출력
        alert("혈당 기록 저장 중 오류가 발생했습니다."); // 오류 알림
    }
});





// document.getElementById('bs-submit').addEventListener('click', async () => {
//     // document.getElementById('my-select');
//     // const selectedValue = selectElement.value; // 여기서 선택된 값을 가져옵니다.
//     try {
//         const response = await axios.post('/api/blood-sugar-logs', {
//             blood_sugar: document.getElementById("record-bs-before").value,
//             record_type: document.getElementById("my-select").value,
//             record_time: `${record_date} ${record_time}`,
//             comments: document.getElementById("eat-memo").value,
//         });
//         const exercise = response.data.data; // API 응답에서 운동 데이터를 가져옴
//         console.log('exercise success:', exercise); // 수정된 부분
//     } catch (error) {
//         console.error('exercise error:', error); // 에러 로그를 콘솔에 출력
//         // 2024-07-24 09:00:00
//     }
// });

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
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

    // let currentDate = new Date(); // 현재 날짜로 초기화

    function updateHeader(date) {
        const options = { year: 'numeric', month: 'long' };
        calendarHeader.textContent = date.toLocaleDateString('ko-KR', options);
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
            });
            calendar.appendChild(dayDiv);
        }
        updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
        record_date = formatDate(selectedDate);

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
});


// 현재 시간 표시 함수
function displayCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    // const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}`;
    document.getElementById('current-time').textContent = currentTimeString;

    record_time = `${hours}:${minutes}:00`
}

// 현재 시간 표시 초기 호출
displayCurrentTime();



// HTML 요소들을 가져오기
const mySelect = document.getElementById('my-select');
const div2 = document.getElementById('div2');
const div3 = document.getElementById('div3');


// 초기화할 때 div2의 초기 내용 저장
const initialDiv2Content = div2.innerHTML;

// select 요소의 onchange 이벤트 핸들러 설정
mySelect.addEventListener('change', function () {
    const selectedOption = mySelect.value;


    if (selectedOption === '아침') {
        // 다른 옵션이 선택된 경우 div2를 숨기고 초기 내용으로 복원
        div3.style.display = 'none';
        div2.innerHTML = initialDiv2Content;
        // div3의 내용을 숨기고 초기화
        div3.style.visibility = 'hidden';
    } else if (selectedOption === '점심') {
        div3.style.display = 'none';
        div2.innerHTML = initialDiv2Content;
        div3.style.visibility = 'hidden';
    } else if (selectedOption === '저녁') {
        div3.style.display = 'none';
        div2.innerHTML = initialDiv2Content;
    } else if (selectedOption === '공복') {
        // 옵션 4 선택 시 div3의 내용을 div2로 이동
        const div3Content = div3.innerHTML;
        div2.innerHTML = div3Content;
        div2.style.display = ''; // div2를 보이게 설정

        // div3의 내용 초기화 (선택 시 필요에 따라)
        // div3.innerHTML = '';
    } else if (selectedOption === '취침 전') {
        const div3Content = div3.innerHTML;
        div2.innerHTML = div3Content;
        div2.style.display = '';
    } else if (selectedOption === '실시간') {
        const div3Content = div3.innerHTML;
        div2.innerHTML = div3Content;
        div2.style.display = '';
    }

});

// 사용자가 입력한 시간 설정 함수(초는 미인식)
function setTime() {
    const timeInput = document.getElementById('time-input').value;

    // 입력값의 길이 확인
    if (timeInput.length > 4) {
        document.getElementById('time-input').value = ''; // 입력 초기화
        document.getElementById('setTime').textContent = ''; // 시간 표시 초기화
        return; // 5자 이상일 경우 함수 종료
    }

    // 입력값이 4자 미만인 경우 시간 표시 초기화
    if (timeInput.length !== 4) {
        document.getElementById('setTime').textContent = '';
        return; // 4자리 입력이 아닐 경우 함수 종료
    }

    // 시간과 분을 분리
    const hour = parseInt(timeInput.substring(0, 2), 10);
    const minute = parseInt(timeInput.substring(2, 4), 10);
    const second = 0; // 초는 0으로 설정

    // 유효성 검사 - 입력 필드가 숫자이고 범위 내에 있는지 확인
    if (isNaN(hour) || isNaN(minute) ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59) {
        alert('올바른 시간을 입력하세요.');
        document.getElementById('setTime').textContent = '';
        return;
    }

    // 입력된 시간으로 시간 설정
    const newTime = new Date();
    newTime.setHours(hour);
    newTime.setMinutes(minute);
 
    // 설정된 시간을 표시
    const hours = String(newTime.getHours()).padStart(2, '0');
    const minutes = String(newTime.getMinutes()).padStart(2, '0');
    const setTimeString = `${hours}:${minutes}`;
    document.getElementById('setTime').textContent = setTimeString;

    // 시간 입력 폼 숨기기
    // document.getElementById('time-input').style.display = 'none';
}

function checkLevelBsBefore() {
    let inputValue = parseFloat(document.getElementById('record-bs-before').value);
    let resultBox1 = document.getElementById('resultBox1');

    if (isNaN(inputValue)) {
        resultBox1.style.backgroundColor = '#FFFFFF';  // 입력 값이 숫자가 아닌 경우 흰색
    } else if (inputValue < 100) {
        resultBox1.style.backgroundColor = '#66CC66';  // 초록색 (정상)
    } else if (inputValue >= 100 && inputValue <= 126) {
        resultBox1.style.backgroundColor = '#FFFF99';  // 노란색 (경고)
    } else {
        resultBox1.style.backgroundColor = '#FF9999';  // 빨간색 (위험)
    }
}


function checkLevelBsAfter() {
    let inputValue2 = parseFloat(document.getElementById('record-bs-after').value);
    let resultBox2 = document.getElementById('resultBox2');

    if (isNaN(inputValue2)) {
        resultBox2.style.backgroundColor = '#FFFFFF';  // 입력 값이 숫자가 아닌 경우 흰색
    } else if (inputValue2 < 140) {
        resultBox2.style.backgroundColor = '#66CC66';  // 초록색 (정상)
    } else if (inputValue2 >= 140 && inputValue2 < 200) {
        resultBox2.style.backgroundColor = '#FFFF99';  // 노란색 (경고)
    } else {
        resultBox2.style.backgroundColor = '#FF9999';  // 빨간색 (위험)
    }
}


