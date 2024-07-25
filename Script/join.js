//한 버튼에 여러 함수를 이용할 수 있도록하는 함
function handleButtonClick(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    addInput(event);
    textChange(event);
    focus();
    adjustButtonPosition()
}
const placeholders = [
    "닉네임",
    "이메일",
    "비밀번호",
    "성별",
    "생년월일"
];

// 화면이 구동되자마자 input 에 포커스가 맞춰짐
window.onload = function() {
    var input = document.getElementById('join_input');
    
    
    // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
    setTimeout(function() {
        input.focus();
    });
};
// 새로운 input에 포커스가 맞춰짐
window.onload = function() {
    var input = document.getElementById('join_input');
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
let placeholderIndex = 0;
const maxInput = 6;
let inputCount = 1;
function addInput(event) {
    event.preventDefault(); // 기본 제출 동작 방지
    if(inputCount<maxInput){
    const placeholder = placeholders[placeholderIndex % placeholders.length];
    const newInputHTML = `<br><br><input type="text" placeholder=${placeholder} id="join_new";><br>`;

        // h2 태그 바로 밑에 새로운 input 태그 추가
        const h2Tag = document.getElementById('join_change');
        h2Tag.insertAdjacentHTML('afterend', newInputHTML);
    placeholderIndex++;
    inputCount++;}
}

// 클릭할때마다 h태그가 바뀜
const maxChange = 7;
let changeCount = 1;
function textChange(event) {
    event.preventDefault();
    const messages = [
        "건강관리 이제 시작입니다! <br>아이디를 입력해주세요.",
        "닉네임을 입력해주세요.",
        "이메일을 입력해주세요.",
        "비밀번호를 입력해주세요.",
        "성별을 알려주세요.",
        "생년월일을 알려주세요.",
        "가입완료되었습니다!"
    ];
    if(changeCount<maxChange){
    const joinChange = document.getElementById("join_change");
    const currentMessageIndex = messages.indexOf(joinChange.innerHTML);
    const nextMessageIndex = (currentMessageIndex + 1) % messages.length;
    joinChange.innerHTML = messages[nextMessageIndex];
    changeCount++}
    else {
        // changeCount가 maxChange를 넘으면 다른 페이지로 이동
        window.location.href = "/";
    }
}

document.getElementById("change_button").addEventListener("click", textChange);