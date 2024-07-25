// a 태그를 여러개 눌렸을때 색깔 유지
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#recipe-name a').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault(); // 링크 클릭 기본 동작 방지
            anchor.classList.toggle('active'); // 'active' 클래스 토글
        });
    });
    // 검색 버튼 클릭 이벤트 핸들러 추가
    document.getElementById('search-button').addEventListener('click', (e) => {
        e.preventDefault(); // 폼의 기본 동작 방지

        // 활성화된 a 태그들 선택
        const activeLinks = document.querySelectorAll('#recipe-name a.active');

        // 활성화된 a 태그들의 텍스트를 로그에 출력
        activeLinks.forEach(link => {
            console.log(link.querySelector('span').textContent);
        });
    });
});

