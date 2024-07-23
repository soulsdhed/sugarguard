$(document).ready(function () {
    $(".selLabel").on('touchstart', function () {
        $('.dropdown').toggleClass('active');
    });

    $(".dropdown-list li").on('touchstart', function () {
        $('.selLabel').text($(this).text());
        $('.dropdown').removeClass('active');
        $('.selected-item p span').text($('.selLabel').text());
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const createOptions = (min, max, step) => {
        let options = '';
        for (let i = min; i <= max; i += step) {
            options += `<div data-value="${i}">${i}</div>`;
        }
        return options;
    };

    const bloodSugarButton = document.getElementById('blood-sugar-button');
    const bloodSugarList = document.getElementById('blood-sugar-list');
    bloodSugarList.innerHTML = createOptions(40, 250, 1);

    const weightButton = document.getElementById('weight-button');
    const weightList = document.getElementById('weight-list');
    weightList.innerHTML = createOptions(20, 200, 1);

    const bloodPressureButton = document.getElementById('blood-pressure-button');
    const bloodPressureList = document.getElementById('blood-pressure-list');
    bloodPressureList.innerHTML = createOptions(40, 250, 1);

    const toggleDropdown = (button, list) => {
        list.classList.toggle('active');
    };

    const selectOption = (button, list) => {
        list.addEventListener('touchstart', function (e) {
            if (e.target && e.target.nodeName === 'DIV') {
                button.textContent = e.target.textContent;
                list.classList.remove('active');
            }
        });
    };

    bloodSugarButton.addEventListener('touchstart', function () {
        toggleDropdown(bloodSugarButton, bloodSugarList);
    });
    selectOption(bloodSugarButton, bloodSugarList);

    weightButton.addEventListener('touchstart', function () {
        toggleDropdown(weightButton, weightList);
    });
    selectOption(weightButton, weightList);

    bloodPressureButton.addEventListener('touchstart', function () {
        toggleDropdown(bloodPressureButton, bloodPressureList);
    });
    selectOption(bloodPressureButton, bloodPressureList);
});

//  상단 왼쪽 오른쪽 실제 날짜 및 시간
function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    document.getElementById('date').textContent = date;
    document.getElementById('time').textContent = time;
}

// 페이지 로드 시와 매초마다 시간 업데이트
window.onload = function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
};