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

    const currentUrl = window.location.pathname;
    const navIcon1 = document.getElementById("navIcon1");
    const navIcon2 = document.getElementById("navIcon2");
    const navIcon3 = document.getElementById("navIcon3");
    const navIcon4 = document.getElementById("navIcon4");
    const navIcon5 = document.getElementById("navIcon5");

    if (currentUrl.includes("/recipe")) {
        navIcon1.classList.add("selected");
        navIcon2.classList.remove("selected");
        navIcon3.classList.remove("selected");
        navIcon4.classList.remove("selected");
        navIcon5.classList.remove("selected");
    }
    if (currentUrl == "/123123") {
        navIcon1.classList.remove("selected");
        navIcon2.classList.add("selected");
        navIcon3.classList.remove("selected");
        navIcon4.classList.remove("selected");
        navIcon5.classList.remove("selected");
    }

    if (currentUrl == "/") {
        navIcon1.classList.remove("selected");
        navIcon2.classList.remove("selected");
        navIcon3.classList.add("selected");
        navIcon4.classList.remove("selected");
        navIcon5.classList.remove("selected");
    }
    if (currentUrl == "/sugardiary") {
        navIcon1.classList.remove("selected");
        navIcon2.classList.remove("selected");
        navIcon3.classList.remove("selected");
        navIcon4.classList.add("selected");
        navIcon5.classList.remove("selected");
    }
    if (currentUrl == "/mypage") {
        navIcon1.classList.remove("selected");
        navIcon2.classList.remove("selected");
        navIcon3.classList.remove("selected");
        navIcon4.classList.remove("selected");
        navIcon5.classList.add("selected");
    }
});
