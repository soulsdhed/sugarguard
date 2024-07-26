const idInput = document.getElementById("login_input_write");
const passInput = document.getElementById("password_input_write");

document.getElementById("login_button").addEventListener("click", async (e) => {
    const userId = idInput.value;
    const password = passInput.value;

    try {
        const response = await axios.post("/api/users/login", {
            userId: userId,
            password: password,
        });
        // console.log("Response:", response.data);
        window.location.href = "/";
    } catch (error) {
        // console.error("Error:", error);
        Swal.fire({
            title: "로그인 실패",
            text: "아이디 혹은 비밀번호가 틀렸습니다.",
            icon: "error",
        });
    }
    // console.log(userId);
    // console.log(password);
});
