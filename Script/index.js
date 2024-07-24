document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("#navBar a");

    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            // 모든 링크에서 'selected' 클래스 제거
            navLinks.forEach((link) => link.classList.remove("selected"));
            navLinks.forEach((link) => link.classList.add("unselected"));

            // 클릭된 링크에 'selected' 클래스 추가
            this.classList.remove("unselected");
            this.classList.add("selected");
        });
    });
});
