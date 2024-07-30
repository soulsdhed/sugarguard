const placeholders = [
    "닉네임(4~20글자)",
    "이메일",
    "아이디(4~12글자)",
    "비밀번호(8~16글자)",
    "성별(남성/여성)",
    "생년월일(예:1986-09-09)",
];
const messages = [
    "닉네임을 입력해주세요.",
    "이메일을 입력해주세요.",
    "아이디을 입력해주세요.",
    "비밀번호를 입력해주세요.",
    "남성/여성을 입력해주세요.",
    "생년월일을 입력주세요.",
];
const join_db_list = [
    "nickname",
    "email",
    "userId",
    "password",
    "gender",
    "birthDate",
];
const join_input_type = ["text", "email", "id", "password", "text", "text"];
const url = "/api/users/";
let userData = {};
document.getElementById("back_button").addEventListener("click", function () {
    window.history.go(-1);
});

let formattedDate;
//한 버튼에 여러 함수를 이용할 수 있도록하는 함
function handleButtonClick(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    // 제한 조건 확인
    if (inputCount > 1) {
        const index = inputCount - 2;
        const currentInputText = placeholders[index];
        const valStr = document.getElementById(join_db_list[index]).value;

        if (currentInputText == "닉네임") {
            // 닉네임 조건
            // if (valStr.length > 20 || valStr.length < 4) {
            //     Swal.fire({
            //         icon: "error",
            //         title: "닉네임을 입력해주세요",
            //     });
            //     return;
            // }

            function validateNickname(valStr) {
                // 한국어 2~8글자, 영어 4~12글자 검사
                const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
                const isEnglish = /[a-zA-Z]/;

                let minLength, maxLength;

                if (isKorean.test(valStr)) {
                    minLength = 2;
                    maxLength = 8;
                } else if (isEnglish.test(valStr)) {
                    minLength = 4;
                    maxLength = 12;
                } else {
                    // 다른 언어는 지원하지 않을 경우
                    Swal.fire({
                        icon: "error",
                        title: "언어를 지원하지 않습니다",
                    });
                    return false;
                }

                // 길이 검사
                if (valStr.length < minLength || valStr.length > maxLength) {
                    Swal.fire({
                        icon: "error",
                        title: "닉네임의 길이를 확인해주세요",
                    });
                    return false;
                }

                // 유효성 통과
                return true;
            }
        } else if (currentInputText == "이메일") {
            // 이메일 조건
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valStr)) {
                Swal.fire({
                    icon: "error",
                    title: "이메일을 입력해주세요",
                });
                return;
            }
        } else if (currentInputText == "아이디") {
            if (valStr.length < 4 || valStr.length > 12) {
                Swal.fire({
                    icon: "error",
                    title: "아이디를 입력해주세요",
                });
                return;
            }
        } else if (currentInputText === "비밀번호") {
            if (valStr.length < 8 || valStr.length > 16) {
                Swal.fire({
                    icon: "error",
                    title: "비밀번호를 입력해주세요",
                });
                return;
            }
        } else if (currentInputText == "성별") {
            if (!["남성", "여성"].includes(valStr)) {
                Swal.fire({
                    icon: "error",
                    title: "성별을 선택해주세요",
                });
                return;
            }
        } else if (currentInputText == "생년월일") {
            // valStr가 yyyyMMdd 형식인지 검사
            const dateRegex = /^\d{8}$/;
            if (!dateRegex.test(valStr)) {
                Swal.fire({
                    icon: "error",
                    title: "생년월일을 입력해주세요",
                });
                return;
            }

            // 입력된 valStr(yyyyMMdd)을 yyyy-mm-dd 형식으로 변환
            formattedDate = `${valStr.substring(0, 4)}-${valStr.substring(
                4,
                6
            )}-${valStr.substring(6)}`;

            // 변환된 날짜를 서버로 보내기
            // 예시: fetch 또는 Ajax를 사용하여 서버로 데이터 전송
            // fetch('/saveBirthday', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ birthDate: formattedDate }),
            // });

            // 예시: 서버로 데이터를 전송하는 부분을 여기에 작성
        }
    }

    let check = addInput(event);
    textChange(event);
    focus();

    if (!check) {
        let userData = {
            nickname: document.getElementById(join_db_list[0]).value,
            email: document.getElementById(join_db_list[1]).value,
            userId: document.getElementById(join_db_list[2]).value,
            password: document.getElementById(join_db_list[3]).value,
            gender: document.getElementById(join_db_list[4]).value,
            birthDate: formattedDate,
        };
        console.log(userData);
        postData(url, userData);
        console.log("데이터 넘어감");
    }
}
//post 정보 보내기
async function postData(url, userData) {
    try {
        const response = await axios.post(url, userData);
        console.log("Success:", response.userData);

        //회원 가입 성공 (메인 페이지로 이동)
        window.location.href = "/login";
        console.log("넘어가기");
    } catch (error) {
        console.log("Error:", error);

        //회원 가입 실패
        Swal.fire({
            icon: "error",
            title: "회원가입 실패했습니다. 다시 확인해주세요.",
        });
    }
}
//email 버튼 함수
async function duplication(email) {
    // event.preventDefault(); // 기본 제출 동작 방지
    checkEmail();
}
//email 중복검사
function checkEmail() {
    const eamilInput = document.getElementById("email");
    console.log(eamilInput);
    const email = document.getElementById("email").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 확인을 위한 정규 표현식

    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "warning",
            title: "유효한 이메일 형식을 입력하세요.",
        });
        return;
    }

    axios
        .get("http://localhost:3000/api/users/exists/email", {
            params: { email },
        })
        .then((response) => {
            console.log(response.data.data.exists);
            if (response.data.data.exists === true) {
                Swal.fire({
                    icon: "error",
                    title: "이메일을 사용한 계정이 있습니다.",
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "사용가능한 이메일 입니다.",
                });
                eamilInput.disabled = true;
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}
// id 중복 검사
async function duplicationId(id) {
    // event.preventDefault(); // 기본 제출 동작 방지
    checkUserId();
}
// id 중복 검사 함수
function checkUserId() {
    const idInput = document.getElementById("userId");
    const userId = document.getElementById("userId").value;

    if (!userId) {
        return next({
            code: "VALIDATION_MISSING_FIELD",
        });
    }

    axios
        .get("http://localhost:3000/api/users/exists/userId", {
            params: { userId },
        })
        .then((response) => {
            if (response.data.data.exists) {
                Swal.fire({
                    icon: "error",
                    title: "중복된 ID가 있습니다.",
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "사용 가능한 ID입니다.",
                });
                idInput.disabled = true;
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
// 화면이 구동되자마자 input 에 포커스가 맞춰짐
window.onload = function () {
    var input = document.getElementById("join_input");

    // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
    setTimeout(function () {
        input.focus();
    });
};
//새로운 input에 포커스가 맞춰짐
window.onload = function () {
    var input = document.getElementById("join_new");

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (
                    node.id === "join_new" &&
                    node.tagName.toLowerCase() === "input"
                ) {
                    // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
                    setTimeout(function () {
                        node.focus();
                        // 키패드를 확실히 띄우기 위해 input 이벤트를 트리거합니다.
                        var event = new Event("input", { bubbles: true });
                        node.dispatchEvent(event);
                    }, 100);
                }
            });
        });
    });

    // 감시를 시작할 DOM 노드와 설정 옵션
    var config = { childList: true, subtree: true };

    // 감시할 대상 노드 설정 (document.body)
    observer.observe(document.body, config);
};

// 버튼을 클릭할때마다 새로운 입력칸이 구현됨
let formData = {};
let placeholderIndex = 0;
let join_db_index = 0;
let joinInputTypeIndex = 0;
const maxInput = 7;
let inputCount = 1;

function addInput(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    if (inputCount < maxInput) {
        const placeholder =
            placeholders[placeholderIndex % placeholders.length];
        const join_db_input = join_db_list[join_db_index % join_db_list.length];
        const joinInputType =
            join_input_type[joinInputTypeIndex % join_input_type.length]; // 동적 타입 지정

        let newInputHTML = "";

        if (joinInputType === "email") {
            // joinInputType이 'userid' 또는 'email'일 때 다른 input 태그와 button 태그 생성
            newInputHTML = `
                <br><br>
                <input type="text" placeholder="${placeholder}" id="${join_db_input}" class="join_new" name="${join_db_input}">
                <button type="button" onclick="duplication('${joinInputType}')">중복검사</button>
                <br>
            `;
        } else if (joinInputType === "id") {
            newInputHTML = `
                <br><br>
                <input type="text" placeholder="${placeholder}" id="${join_db_input}" class="join_new" name="${join_db_input}">
                <button type="button" onclick="duplicationId('${joinInputType}')">중복검사</button>
                <br>
            `;
        } else {
            // 일반 input 태그 생성
            newInputHTML = `
                <br><br>
                <input type="${joinInputType}" placeholder="${placeholder}" id="${join_db_input}" class="join_new" name="${join_db_input}">
                <br>
            `;
        }
        // h2 태그 바로 밑에 새로운 input 태그 추가
        const h2Tag = document.getElementById("join_change");
        h2Tag.insertAdjacentHTML("afterend", newInputHTML);

        placeholderIndex++;
        join_db_index++;
        joinInputTypeIndex++;

        inputCount++;
        return true;
    }
    return false;
}

// 클릭할때마다 h태그가 바뀜
const maxChange = 7;
let changeCount = 1;
function textChange(event) {
    event.preventDefault();

    if (changeCount < maxChange) {
        const joinChange = document.getElementById("join_change");
        const currentMessageIndex = messages.indexOf(joinChange.innerHTML);
        const nextMessageIndex = (currentMessageIndex + 1) % messages.length;
        joinChange.innerHTML = messages[nextMessageIndex];
        changeCount++;
    } else {
        // changeCount가 maxChange를 넘으면 다른 페이지로 이동
        // window.location.href = "/";
    }
}
