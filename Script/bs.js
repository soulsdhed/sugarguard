// 현재 날짜를 가져오는 함수
function getCurrentDate() {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    let day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}


// 페이지 로딩 시 현재 날짜를 입력 필드에 설정
document.getElementById('recordDate').value = getCurrentDate();

// 날짜 선택이 변경될 때 호출되는 함수
function updateDate() {
    let selectedDate = document.getElementById('recordDate').value;
    console.log('선택된 날짜:', selectedDate);
    // 여기서 선택된 날짜에 따라 추가적인 처리를 할 수 있습니다.
}



// 현재 시간 표시 함수
function displayCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTimeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('current-time').textContent = currentTimeString;
}

// 현재 시간 표시 초기 호출
displayCurrentTime();

// 시간 입력 폼 표시 함수
function inputTime() {
    document.getElementById('time-input').style.display = 'block';
}

// 다음 입력 필드로 이동하는 함수
function moveToNextField(event, nextFieldId) {
    const input = event.target;
    if (input.value.length >= 2) {
        const nextField = document.getElementById(nextFieldId);
        nextField.focus();
    }
}

// 사용자가 입력한 시간 설정 함수
function setTime() {
    const hour = document.getElementById('hour').value;
    const minute = document.getElementById('minute').value;
    const second = document.getElementById('second').value;

    // 유효성 검사 - 각 입력 필드가 숫자이고 범위 내에 있는지 확인
    if (isNaN(hour) || isNaN(minute) || isNaN(second) ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59 ||
        second < 0 || second > 59) {
        alert('올바른 시간을 입력하세요.');
        return;
    }

    // 입력된 시간으로 시간 설정
    const newTime = new Date();
    newTime.setHours(parseInt(hour, 10));
    newTime.setMinutes(parseInt(minute, 10));
    newTime.setSeconds(parseInt(second, 10));

    // 설정된 시간을 표시
    const hours = String(newTime.getHours()).padStart(2, '0');
    const minutes = String(newTime.getMinutes()).padStart(2, '0');
    const seconds = String(newTime.getSeconds()).padStart(2, '0');
    const setTimeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('current-time').textContent = setTimeString;

    // 시간 입력 폼 숨기기
    document.getElementById('time-input').style.display = 'none';
}
    // 1초마다 현재 시간 업데이트
    setInterval(displayCurrentTime, 1000);




function checkLevelBsBefore() {
    let inputValue = parseFloat(document.getElementById('recordBsBefore').value);
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
    let inputValue2 = parseFloat(document.getElementById('recordBsAfter').value);
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


