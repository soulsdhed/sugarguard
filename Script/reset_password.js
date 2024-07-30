document.addEventListener("DOMContentLoaded", (e) => {
    const resetButton = document.getElementById("reset-password-button");
    const pwInput = document.querySelectorAll(".reset-password-input")[0];
    const pwReInput = document.querySelectorAll(".reset-password-input")[1];

    const path = window.location.pathname;
    const match = path.match(/\/reset-password\/([^\/]+)/);
    const token = match ? match[1] : null;

    resetButton.addEventListener("click", async (e) => {
        // 비밀번호 규칙 확인
        const pwValue = pwInput.value;
        const pwReValue = pwReInput.value;
        const allowedSpecialCharacters = '!@#$%^&*(),.?":{}|<>'; // 사용할 수 있는 특수 문자 정의
        const specialCharPattern = new RegExp(
            "^[a-zA-Z0-9" +
                allowedSpecialCharacters
                    .split("")
                    .map((char) => "\\" + char)
                    .join("") +
                "]*$"
        );

        // 비밀번호가 서로 다른 경우
        if (pwValue !== pwReValue) {
            return Swal.fire({
                title: "비밀번호 불일치",
                text: "비밀번호가 일치하지 않습니다.",
                icon: "error",
            });
        }

        // 비밀 번호 글자수 부족 혹은 과다
        if (pwValue.length < 8 || pwValue.length > 16) {
            return Swal.fire({
                title: "비밀번호 오류",
                text: "비밀번호 글자수가 부족하거나 너무 많습니다.",
                icon: "error",
            });
        }

        // 비밀번호에 영어, 숫자, 특문 이외의 문자가 있으면 안된다
        if (!/^[\x00-\x7F]*$/.test(pwValue)) {
            return Swal.fire({
                title: "비밀번호 오류",
                text: "비밀 번호에는 영어, 숫자, 특수 문자 이외의 문자는 사용할 수 없습니다.",
                icon: "error",
            });
        }

        // 특수 문자 제한
        if (!specialCharPattern.test(pwValue)) {
            return Swal.fire({
                title: "비밀번호 오류",
                text:
                    "허용된 특수 문자만 포함될 수 있습니다 : " +
                    allowedSpecialCharacters,
                icon: "error",
            });
        }

        // 비밀번호 변경 api call
        console.log(token);
        try {
            const response = await axios.put(`/api/users/password/${token}`, {
                password: pwValue,
            });
        } catch (e) {
            return Swal.fire({
                title: "비밀번호 변경 실패",
                text: "관리자에게 문의해주세요.",
                icon: "error",
            });
        }

        return Swal.fire({
            title: "비밀번호 변경 완료",
            text: "비밀번호가 성공적으로 변경되었습니다.",
            icon: "success",
            confirmButtonText: "로그인",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/login";
            }
        });
    });
});
