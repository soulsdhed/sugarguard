const placeholders = [
    "닉네임",
    "이메일",
    "아이디",
    "비밀번호",
    "성별",
    "생년월일"
];
const messages = [
    "건강관리 이제 시작입니다! <br>닉네임을 입력해주세요.",
    "이메일을 입력해주세요.",
    "아이디을 입력해주세요.",
    "비밀번호를 입력해주세요.",
    "성별을 알려주세요.",
    "생년월일을 알려주세요.",
    "가입완료되었습니다!"
];
const join_db_list =[
    "nickname",
    "email",
    "userId",
    "password",
    "gender",
    "birthDate"
]
const join_input_type =[
    "text",
    "email",
    "text",
    "password",
    "radio",
    "text"
]

const data = {
    nickname:"nickname",
    email:"testemail@test.com",
    userId:"testuserid",
    password:"password",
    gender:"남성",
    birthDate:"2000-08-12"
};
const url = '/api/users/';

//한 버튼에 여러 함수를 이용할 수 있도록하는 함
function handleButtonClick(event) {
    event.preventDefault(); // 기본 제출 동작 방지

    // 제한 조건 확인
    // TODO : 에러 처리 조건 따로 예쁘게 변경할 것
    if (inputCount > 1 ){
        const index = inputCount - 2;
        const currentInputText = placeholders[index]
        const valStr = document.getElementById(join_db_list[index]).value

        if (currentInputText == "닉네임"){
            // 닉네임 조건
            if (valStr.length > 20 || valStr.length < 4) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
                return;
            }
        } else if (currentInputText == "이메일") {
            // 이메일 조건
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valStr)) {
                alert("Email Error");
                return;
            }
        } else if (currentInputText == "아이디") {
            if (valStr.length < 4 || valStr.length > 12) {
                alert("ID Error");
                return;
            }
        } else if (currentInputText === "비밀번호") {
            if (valStr.length < 8 || valStr.length > 16) {
                alert("password Error")
                return;
            }
        } else if (currentInputText == "성별") {
            if (!["남성", "여성"].includes(valStr)) {
                alert("gender Error")
                return;
            }
        } else if (currentInputText == "생년월일") {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(valStr)) {
                alert("Birth Date Error")
                return;
            }
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
            // gender: document.getElementById(join_db_list[4]).value,
            birthDate: document.getElementById(join_db_list[5]).value,
        }
        if (true) {
            userData.gender = "남성"
        } else {
            userData.gender = "여성"
        }
        
        console.log(userData)
        postData(url, userData);
    }
}
async function postData(url, data) {
    try {
        const response = await axios.post(url, data);
        console.log('Success:', response.data);

        // 회원 가입 성공 (메인 페이지로 이동)
        // window.location.href = "/";
    } catch (error) {
        console.error('Error:', error);

        // TODO : 회원 가입 실패
        alert("회원 가입에 실패했습니다. 관리자에게 문의해주세요.")
    }
}
  
// 화면이 구동되자마자 input 에 포커스가 맞춰짐
window.onload = function() {
    var input = document.getElementById('join_input');
    
    
    // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
    setTimeout(function() {
        input.focus();
    });
};
//새로운 input에 포커스가 맞춰짐
window.onload = function() {
    var input = document.getElementById('join_new');
    setTimeout(function() {
        input.focus();
    });
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.id === 'join_new' && node.tagName.toLowerCase() === 'input') {
                    // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
                    setTimeout(function() {
                        node.focus();
                        // 키패드를 확실히 띄우기 위해 input 이벤트를 트리거합니다.
                        var event = new Event('input', { bubbles: true });
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
let join_db_index=0;
let joinInputTypeIndex = 0;
const maxInput = 7;
let inputCount = 1;

function addInput(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    if(inputCount<maxInput) {
        const placeholder = placeholders[placeholderIndex % placeholders.length];
        const join_db_input = join_db_list[join_db_index % join_db_list.length];
        const joinInputType = join_input_type[joinInputTypeIndex % join_input_type.length]; // 동적 타입 지정

        let newInputHTML;
        if(joinInputType === "radio"){
            newInputHTML = `
            <br><br>
            <label>
                <input type="radio" name="gender" value="남성"> 남성
            </label>
            <label>
                <input type="radio" name="gender" value="여성"> 여성
            </label>
            <br>`; 
        }else{
            newInputHTML = `<br><br><input type=${joinInputType} placeholder=${placeholder} id=${join_db_input} class="join_new" name=${join_db_input};><br>`;
        }

        // h2 태그 바로 밑에 새로운 input 태그 추가
        const h2Tag = document.getElementById('join_change');
        h2Tag.insertAdjacentHTML('afterend', newInputHTML);
        if (joinInputType !== "radio") {
            placeholderIndex++;
            join_db_index++;
            joinInputTypeIndex++;
        }

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
    
    if(changeCount<maxChange){
    const joinChange = document.getElementById("join_change");
    const currentMessageIndex = messages.indexOf(joinChange.innerHTML);
    const nextMessageIndex = (currentMessageIndex + 1) % messages.length;
    joinChange.innerHTML = messages[nextMessageIndex];
    changeCount++}
    else {
        // changeCount가 maxChange를 넘으면 다른 페이지로 이동
        // window.location.href = "/";
    }
}

// postData();