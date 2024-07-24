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




function checkLevelBsBefore() {
    let inputValue = parseFloat(document.getElementById('recordBsBefore').value);
    let resultBox1 = document.getElementById('resultBox1');

    if (isNaN(inputValue)) {
        resultBox1.style.backgroundColor = '#FFFFFF';  // 입력 값이 숫자가 아닌 경우 흰색
    } else if (inputValue < 140) {
        resultBox1.style.backgroundColor = '#66CC66';  // 초록색 (정상)
    } else if (inputValue >= 140 && inputValue < 200) {
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


