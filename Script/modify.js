// 재시도가 필요한 fetch의 경우 아래 함수들을 반드시 가져가야한다
// refresh함수를 통한 accessToken 재발행 받기
const refreshAccessToken = async () => {
    try {
        const response = await axios.post(
            "/api/auth/token",
            {},
            {
                withCredentials: true,
            }
        );
        // const { accessToken } = response.data;
        // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (e) {
        console.error("Failed to refresh access token:", e);
        throw e;
    }
};
// 재시도를 포함한 get fetch
const fetchGetWithRetry = async (url, options = {}, retries = 1) => {
    try {
        const response = await axios.get(url, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchGetWithRetry(url, options, retries - 1);
        } else {
            throw e;
        }
    }
};
// // 재시도를 포함한 post fetch
// const fetchPostWithRetry = async (url, data = {}, options = {}, retries = 1) => {
//     try {
//         const response = await axios.post(url, data, options);
//         return response;
//     } catch (e) {
//         if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
//             console.log("Access token expired. Fetching new token...");
//             await refreshAccessToken();
//             return fetchPostWithRetry(url, data, options, retries - 1);
//         } else {
//             throw e;
//         }
//     }
// }
// 재시도를 포함한 patch fetch
const fetchPatchWithRetry = async (
    url,
    data = {},
    options = {},
    retries = 1
) => {
    try {
        const response = await axios.patch(url, data, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchPatchWithRetry(url, data, options, retries - 1);
        } else {
            throw e;
        }
    }
};
// 재시도를 포함한 delete fetch
const fetchDeleteWithRetry = async (
    url,
    data = {},
    options = {},
    retries = 1
) => {
    try {
        const response = await axios.delete(url, data, options);
        return response;
    } catch (e) {
        if (
            e.response.data.error.code === "AUTH_EXPIRED_TOKEN" &&
            retries > 0
        ) {
            console.log("Access token expired. Fetching new token...");
            await refreshAccessToken();
            return fetchPatchWithRetry(url, data, options, retries - 1);
        } else {
            throw e;
        }
    }
};

function formatToKST(isoDate) {
    const date = new Date(isoDate);
    const options = { timeZone: "Asia/Seoul" };
    const year = date.toLocaleString("ko-KR", { ...options, year: "numeric" });
    const month = date.toLocaleString("ko-KR", {
        ...options,
        month: "2-digit",
    });
    const day = date.toLocaleString("ko-KR", { ...options, day: "2-digit" });

    return `${year} ${month} ${day}`;
}

const isValidDate = (dateString) => {
    // Check for null or undefined
    if (dateString == null) {
        return false;
    }
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
    );
};

document.addEventListener("DOMContentLoaded", async (event) => {
    // 넌적스 템플릿으로부터 userId 가져오기 (로그인 여부 확인)
    const userId = window.userIdFromTemplate;
    const passwordInput = document.getElementById("modify-password");
    const nicknameInput = document.getElementById("modify-nickname");
    const genderDivs = document.querySelectorAll("#modify-gender div");
    const yearInput = document.getElementById("modify-birthday-year");
    const monthInput = document.getElementById("modify-birthday-month");
    const dayInput = document.getElementById("modify-birthday-day");
    const diabetesTypeInput = document.getElementById("modify-diabetes-type");

    // 로그인 되어 있지 않으면 로그인 화면으로
    if (!userId) {
        return (window.location.href = "/login");
    }

    // 회원 정보 받아오기 api call
    try {
        const response = await fetchGetWithRetry("/api/users", {
            withCredentials: true,
        });
        console.log(response);

        // 각 부분에 맞게 회원 정보 입력해주기
        const {
            userId,
            nickname,
            gender,
            email,
            diabetes_type,
            birth_date,
            created_at,
        } = response.data.data;
        // 아이디
        document.getElementById("id-td").innerText = userId;
        // 비번 (없음)
        // 이메일
        document.getElementById("email-td").innerText = email;
        // 닉네임
        nicknameInput.value = nickname;
        // 성별
        genderDivs.forEach((item) => {
            if (item.innerText == gender) {
                item.classList.add("selected-gender");
            } else {
                item.classList.remove("selected-gender");
            }
        });
        // 생일
        const birthDate = new Date(birth_date);
        const options = {
            timeZone: "Asia/Seoul",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };
        const kstDate = birthDate
            .toLocaleDateString("ko-KR", options)
            .split(". ")
            .map((part) => part.replace(".", ""));
        const year = kstDate[0];
        const month = kstDate[1].padStart(2, "0");
        const day = kstDate[2].padStart(2, "0");
        yearInput.value = year;
        monthInput.value = month;
        dayInput.value = day;

        // 당뇨 유형
        diabetesTypeInput.value = diabetes_type;

        // 가입일
        // 날짜 객체 생성
        document.getElementById("created-at-td").innerText =
            formatToKST(created_at);
    } catch (e) {
        // 회원 정보 불러오기 실패
        Swal.fire({
            title: "회원 정보 불러오기 실패",
            text: "관리자에게 문의바랍니다.",
            icon: "error",
            confirmButtonText: "확인",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/";
            }
        });
    }

    // Element
    // 뒤로 가기 버튼
    document.getElementById("modify-goback").addEventListener("click", (e) => {
        history.back();
    });

    // 성별 선택
    genderDivs.forEach((i) => {
        i.addEventListener("click", (e) => {
            i.classList.add("selected-gender");
            genderDivs.forEach((item) => {
                if (i != item) item.classList.remove("selected-gender");
            });
        });
    });

    // 회원 정보 수정 버튼
    document
        .getElementById("modify-button")
        .addEventListener("click", async (event) => {
            const password = passwordInput.value;
            const nickname = nicknameInput.value;
            const gender = document.querySelector(".selected-gender").innerText;
            const birthDate = `${yearInput.value}-${monthInput.value}-${dayInput.value}`;
            const diabetesType = diabetesTypeInput.valaue;

            // 유효성 검사
            const allowedSpecialCharacters = '!@#$%^&*(),.?":{}|<>'; // 사용할 수 있는 특수 문자 정의
            const specialCharPattern = new RegExp(
                "^[a-zA-Z0-9" +
                    allowedSpecialCharacters
                        .split("")
                        .map((char) => "\\" + char)
                        .join("") +
                    "]*$"
            );
            // 비밀 번호 글자수 부족 혹은 과다
            if (password.length < 8 || password.length > 16) {
                return Swal.fire({
                    title: "비밀번호 오류",
                    text: "비밀번호 글자수가 부족하거나 너무 많습니다.",
                    icon: "error",
                });
            }
            // 비밀번호에 영어, 숫자, 특문 이외의 문자가 있으면 안된다
            if (!/^[\x00-\x7F]*$/.test(password)) {
                return Swal.fire({
                    title: "비밀번호 오류",
                    text: "비밀 번호에는 영어, 숫자, 특수 문자 이외의 문자는 사용할 수 없습니다.",
                    icon: "error",
                });
            }
            // 특수 문자 제한
            if (!specialCharPattern.test(password)) {
                return Swal.fire({
                    title: "비밀번호 오류",
                    text:
                        "허용된 특수 문자만 포함될 수 있습니다 : " +
                        allowedSpecialCharacters,
                    icon: "error",
                });
            }
            // 닉네임 제한
            if (nickname.length < 4 || nickname.length > 20) {
                return Swal.fire({
                    title: "닉네임 오류",
                    text: "닉네임 글자수가 부족하거나 너무 많습니다.",
                    icon: "error",
                });
            }
            // 날자 형식 검사
            if (!isValidDate(birthDate)) {
                return Swal.fire({
                    title: "생일 오류",
                    text: "정상적인 날짜를 입력해야 합니다.",
                    icon: "error",
                });
            }

            try {
                const response = await fetchPatchWithRetry(
                    "/api/users",
                    {
                        password,
                        nickname,
                        gender,
                        birthDate,
                        diabetesType,
                    },
                    {
                        withCredentials: true,
                    }
                );
                console.log(response);
            } catch (e) {
                return Swal.fire({
                    title: "회원 정보 변경 실패",
                    text: "회원 정보 변경에 실패했습니다. 관리자에게 문의해주세요.",
                    icon: "error",
                    confirmButtonText: "확인",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/";
                    }
                });
            }

            return Swal.fire({
                title: "회원 정보 변경 성공",
                text: "회원 정보를 성공적으로 변경했습니다.",
                icon: "success",
                confirmButtonText: "확인",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/";
                }
            });
        });

    // 회원 탈퇴 버튼
    document
        .getElementById("modify-resign-button")
        .addEventListener("click", (event) => {
            Swal.fire({
                title: "회원 탈퇴",
                text: "회원 탈퇴 하시겠습니까?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "예",
                cancelButtonText: "아니오",
                customClass: {
                    confirmButton: "my-cancel-button",
                    cancelButton: "my-confirm-button",
                },
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // 한번 더 묻기
                    Swal.fire({
                        title: "회원 탈퇴",
                        text: "정말로 탈퇴를 하시겠습니까? 이 행위는 되돌릴 수 없습니다.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "예",
                        cancelButtonText: "아니오",
                        customClass: {
                            confirmButton: "my-cancel-button",
                            cancelButton: "my-confirm-button",
                        },
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            // 회원 탈퇴 api 연결
                            try {
                                const res = await fetchDeleteWithRetry(
                                    "/api/users",
                                    {},
                                    {
                                        withCredentials: true,
                                    }
                                );
                                console.log(res);
                                window.location.href = "/";
                            } catch (e) {
                                Swal.fire(
                                    "에러 발생",
                                    "에러가 발생했습니다. 관리자에게 문의해주세요.",
                                    "error"
                                );
                            }
                        }
                    });
                }
            });
        });

    // 로딩화면 제거
    document.getElementById("loading-screen").style.display = "none";
});
