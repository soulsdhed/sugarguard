document.addEventListener("DOMContentLoaded", (e) => {
    document.getElementById("login_button").addEventListener("click", (e) => {
        const email = document.getElementById("login_input_write").value;

        // 이메일이 정상적인지 확인
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Swal.fire({
                title: "이메일 오류",
                text: "옳바른 이메일을 입력해주세요.",
                icon: "error",
            });
        }

        // 비밀번호 변경 메일 전송
        try {
            const response = axios.post("/api/users/password-reset-requests", {
                email: email,
            });
            console.log(response);
        } catch (e) {
            return Swal.fire({
                title: "이메일 전송 오류",
                text: "서버 관리자에게 문의해주세요.",
                icon: "error",
            });
        }

        // 비밀번호 변경 메일 전송 완료
        return Swal.fire({
            title: "이메일 전송 완료",
            text: "비밀번호 변경을 위한 이메일이 전송되었습니다.",
            icon: "success",
            confirmButtonText: "로그인",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/";
            }
        });
    });
});
