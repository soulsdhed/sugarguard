

// 아침, 점심, 저녁 식전, 식후로 구별해서 저장 안 됨
// 취침 전도 저장 안 됨
// 공복, 실시간은 제대로 저장됨

const selectElement = document.getElementById('bs');
// const selectedValue = selectElement.value;
let record_date = "";
let record_time = "";

document.getElementById('bs-submit').addEventListener('click', async () => {
    const selectedValue = document.getElementById('my-select').value; // 선택된 값을 가져옵니다.
    
//     // 혈당 값을 저장할 변수
// let bloodSugarValue;

// // 혈당 값이 유효한지 확인하는 함수
// function validateBloodSugar(value) {
//     if (value === "" || isNaN(value)) {
//         alert("혈당 값을 올바르게 입력하세요."); // 유효하지 않은 입력에 대한 경고
//         return false;
//     }
//     return true;
// }

// 혈당 값을 저장하는 함수
async function saveBloodSugar(selectedValue) {
    let bloodSugarValue;

    // 선택된 식사 유형에 따라 혈당 값 가져오기
    if (selectedValue === "아침" || selectedValue === "점심" || selectedValue === "저녁") {
        bloodSugarValue = document.getElementById("record-bs-after").value; // 식후 혈당
    } else {
        bloodSugarValue = document.getElementById("record-bs-before").value; // 식전 혈당
    }

    // 혈당 값 유효성 확인
    if (!validateBloodSugar(bloodSugarValue)) {
        return;
    }

    try {
        const response = await axios.post('/api/blood-sugar-logs', {
            blood_sugar: bloodSugarValue, // 선택된 혈당 값
            record_type: selectedValue, // 선택된 식사 유형
            record_time: `${record_date} ${record_time}`, // 기록 시간
            comments: document.getElementById("eat-memo").value, // 추가 메모
        });

        const exercise = response.data.data; // API 응답에서 운동 데이터를 가져옴
        console.log('exercise success:', exercise); // 수정된 부분
        Swal.fire({
            icon: "success",
            title: "혈당 기록이 성공적으로 저장되었습니다."
          });; // 성공적으로 저장되었음을 알림
    } catch (error) {
        console.error('exercise error:', error); // 에러 로그를 콘솔에 출력
        Swal.fire({
            icon: "error",
            title: "혈당 기록 저장 중 오류가 발생했습니다. 다시 시도해주세요."
          });; // 오류 알림
    }
}

// submit 버튼 클릭 이벤트 리스너
document.getElementById('bs-submit').addEventListener('click', async () => {
    const selectedValue = document.getElementById('my-select').value; // 선택된 값을 가져옵니다.
    await saveBloodSugar(selectedValue); // 혈당 값을 저장
});

// 선택된 옵션에 따라 div2와 div3의 내용을 업데이트하는 코드
mySelect.addEventListener('change', function () {
    const selectedOption = mySelect.value;

    if (selectedOption === '아침' || selectedOption === '점심' || selectedOption === '저녁') {
        div3.style.display = 'none';
        div2.innerHTML = initialDiv2Content; // div2를 초기 내용으로 복원
    } else if (selectedOption === '공복' || selectedOption === '취침 전' || selectedOption === '실시간') {
        div2.innerHTML = ''; // div2 초기화
        div3.style.display = ''; // div3를 보이게 설정
    }
})});




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
const div1 = document.getElementById('div1');
const div2 = document.getElementById('div2');


// 초기화할 때 div2의 초기 내용 저장
const initialDiv1Content = div1.innerHTML;

// select 요소의 onchange 이벤트 핸들러 설정
mySelect.addEventListener('change', function () {
    const selectedOption = mySelect.value;


    if (selectedOption === '아침 식후') {
        // 다른 옵션이 선택된 경우 div1를 숨기고 초기 내용으로 복원
        div2.style.display = 'none';
        div1.innerHTML = initialDiv2Content;
        // div2의 내용을 숨기고 초기화
        div2.style.visibility = 'hidden';
    } else if (selectedOption === '점심 식후') {
        div2.style.display = 'none';
        div1.innerHTML = initialDiv2Content;
        div2.style.visibility = 'hidden';
    } else if (selectedOption === '저녁 식후') {
        div2.style.display = 'none';
        div1.innerHTML = initialDiv2Content;
        div2.style.visibility = 'hidden';
    } else if (selectedOption === '아침 식전') {
        // 옵션 4 선택 시 div2의 내용을 div1로 이동
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = ''; // div1를 보이게 설정

        // div1의 내용 초기화 (선택 시 필요에 따라)
        // div1.innerHTML = '';
    } else if (selectedOption === '점심 식전') {
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = '';
    } else if (selectedOption === '저녁 식전') {
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = '';
    } else if (selectedOption === '취침 전') {
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = '';
    } else if (selectedOption === '실시간') {
        const div2Content = div2.innerHTML;
        div1.innerHTML = div2Content;
        div1.style.display = '';
    }

});


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
};
