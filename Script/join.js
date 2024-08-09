// 유효성 검사
// 아이디
const isValidUserId = (userId) => {
  // 영어와 숫자만 가능하도록 (4-12글자)
  const pattern = /^[A-Za-z0-9]{4,12}$/;
  return pattern.test(userId);
};
// 이메일
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// 비밀번호
const isValidPassword = (password) => {
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
    return false;
  }
  // 비밀번호에 영어, 숫자, 특문 이외의 문자가 있으면 안된다
  if (!/^[\x00-\x7F]*$/.test(password)) {
    return false;
  }
  // 특수 문자 제한
  if (!specialCharPattern.test(password)) {
    return false;
  }
  // 반드시 영어, 숫자, 특수 문자를 포함해야 한다
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = new RegExp(
    "[" +
      allowedSpecialCharacters
        .split("")
        .map((char) => "\\" + char)
        .join("") +
      "]"
  ).test(password);

  if (!hasLetter || !hasNumber || !hasSpecialChar) {
    return false;
  }

  return true;
};
const isValidNickname = (nickname) => {
  // 닉네임 글자 수 조건 (2자 이상 20자 이하)
  if (nickname.length < 2 || nickname.length > 20) {
    return false;
  }
  return true;
};
const isValidDate = (dateString) => {
  // Check for null or undefined
  if (dateString == null) {
    return false;
  }
  const regex = /^\d{8}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

const formatDateString = (dateString) => {
  if (!/^\d{8}$/.test(dateString)) {
    throw new Error("Invalid date format. Please use YYYYMMDD.");
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  return `${year}-${month}-${day}`;
};

const stepStr = [
  "id",
  "email",
  "password",
  "nickname",
  "gender",
  "birthdate",
  "diabetes-type",
];
const stepDivs = [];
let step = 0;

document.addEventListener("DOMContentLoaded", () => {
  // 요소
  const idInput = document.getElementById("id-input");
  const idExistsButton = document.getElementById("id-exist-button");
  const emailInput = document.getElementById("email-input");
  const emailExistsButton = document.getElementById("email-exist-button");
  const passwordInput = document.getElementById("password-input");
  const nicknameInput = document.getElementById("nickname-input");
  const genderDivs = [
    document.getElementById("gender-male"),
    document.getElementById("gender-female"),
  ];
  const birthDateInput = document.getElementById("birthdate-input");
  const diabetesTypeInput = document.getElementById("diabetes-type-input");

  // div 전부 선택
  stepStr.forEach((e) => {
    stepDivs.push(document.getElementById(`${e}-content`));
  });

  // 이전 버튼
  document.getElementById("join-prev-button").addEventListener("click", () => {
    // console.log("이전");

    // 0단계 (아무것도 없다)
    if (step == 0) {
      history.back();
    } else if (step == 1) {
      // 아이디 (전단계 : 없음)
      stepDivs[step - 1].classList.add("hidden-div");
    } else if (step == 2) {
      // 이메일 (전단계 : 아이디)
      stepDivs[step - 1].classList.add("hidden-div");

      // 전단계 아이디를 살려주자
      idInput.disabled = false;
      idInput.style.backgroundColor = "white";
      idInput.style.color = "black";

      idExistsButton.disabled = false;
      idExistsButton.style.backgroundColor = "#FF5C5C";
    } else if (step == 3) {
      // 비밀번호 (전단계 이메일)
      stepDivs[step - 1].classList.add("hidden-div");

      // 전단계 이메일을 살려주자
      emailInput.disabled = false;
      emailInput.style.backgroundColor = "white";
      emailInput.style.color = "black";

      emailExistsButton.disabled = false;
      emailExistsButton.style.backgroundColor = "#FF5C5C";
    } else if (step == 4) {
      // 닉네임 (전단계 비밀번호)
      stepDivs[step - 1].classList.add("hidden-div");

      // 전단계 비밀번호를 살려주자
      passwordInput.disabled = false;
      passwordInput.style.backgroundColor = "white";
      passwordInput.style.color = "black";
    } else if (step == 5) {
      // 성별 (전단계 닉네임)
      stepDivs[step - 1].classList.add("hidden-div");

      // 전단계 닉네임을 살려주자
      nicknameInput.disabled = false;
      nicknameInput.style.backgroundColor = "white";
      nicknameInput.style.color = "black";
    } else if (step == 6) {
      // 생일 (전단계 성별)
      stepDivs[step - 1].classList.add("hidden-div");

      // 전단계 성별을 살려주자
      genderDivs.forEach((e) => {
        e.disabled = false;
        e.style.backgroundColor = "white";
        e.style.color = "black";
      });
    } else if (step == 7) {
      // 당뇨 유형 (전단계 생일)
      stepDivs[step - 1].classList.add("hidden-div");

      // 전단계 생일을 살려주자
      birthDateInput.disabled = false;
      birthDateInput.style.backgroundColor = "white";
      birthDateInput.style.color = "black";
    }
    step--;
  });

  // 다음 버튼
  document
    .getElementById("join-next-button")
    .addEventListener("click", async () => {
      // console.log("다음");

      if (step == 0) {
        // 아이디 (전단계 : 없음)
        // console.log(stepDivs[step]);
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 1) {
        // 이메일 (전단계 : 아이디)
        // 아이디 중복 검사를 하지 않으며 안된다.
        if (idInput.disabled == false) {
          return Swal.fire({
            title: "아이디 중복 검사",
            text: "아이디 중복 검사를 해주세요",
            icon: "warning",
          });
        }

        // 이메일을 보여주자
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 2) {
        // 비밀번호 (전단계 : 이메일)
        // 이메일 중복 검사를 하지 않으면 안된다.
        if (emailInput.disabled == false) {
          return Swal.fire({
            title: "이메일 중복 검사",
            text: "이메일 중복 검사를 해주세요",
            icon: "warning",
          });
        }

        // 비밀번호를 보여주자
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 3) {
        // 닉네임 (전단계 : 비밀번호)
        // 비밀번호 유효성 검사
        const password = passwordInput.value;
        if (!isValidPassword(password)) {
          // 응 안돼
          return Swal.fire({
            title: "비밀번호 규칙 오류",
            text: "비밀번호는 4글자 이상으로 반드시 영문, 숫자, 특문이 혼합되어 있어야 합니다.",
            icon: "warning",
          });
        }

        // 비밀번호 사용 못하게 하자!
        passwordInput.disabled = true;
        passwordInput.style.backgroundColor = "whitesmoke";
        passwordInput.style.color = "darkgray";

        // 닉네임 보여주자
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 4) {
        // 성별 (전단계 : 닉네임)
        // 닉네임 유효성 검사
        const nickname = nicknameInput.value;
        if (!isValidNickname(nickname)) {
          // 응 안돼
          return Swal.fire({
            title: "닉네임 오류",
            text: "닉네임은 2글자 이상으로 작성해주세요",
            icon: "warning",
          });
        }

        // 닉네임을 사용못하게 하자
        nicknameInput.disabled = true;
        nicknameInput.style.backgroundColor = "whitesmoke";
        nicknameInput.style.color = "darkgray";

        // 성별 보여주자
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 5) {
        // 생일

        // 성별을 사용 못하게 하자
        genderDivs.forEach((e) => {
          e.disabled = true;
          e.style.backgroundColor = "whitesmoke";
          e.style.color = "darkgray";
        });

        // 생일 보여주자
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 6) {
        // 당뇨 유형
        // 생일 유효성 검사
        const birthDate = birthDateInput.value;
        if (!isValidDate(birthDate)) {
          return Swal.fire({
            title: "생년월일 오류",
            text: "유효한 생년월일 (예 19990101)을 작성해주세요",
            icon: "warning",
          });
        }

        // 생일 사용 못하게 하자
        birthDateInput.disabled = true;
        birthDateInput.style.backgroundColor = "whitesmoke";
        birthDateInput.style.color = "darkgray";

        // 당뇨 유형 보여주자
        stepDivs[step].classList.remove("hidden-div");
        stepDivs[step].classList.add("slide-down");
      } else if (step == 7) {
        // 회원 가입하자!!
        const userId = idInput.value;
        const password = passwordInput.value;
        const email = emailInput.value;
        const nickname = nicknameInput.value;
        const gender = document.querySelector(".gender-selected").innerText;
        const birthDate = formatDateString(birthDateInput.value);
        const diabetesType = diabetesTypeInput.value;

        // TODO : 혹시 모를 마지막 모든 유효성 검사!! (안해도 되긴 하는데...)

        try {
          const response = await axios.post("/api/users", {
            userId: userId,
            password: password,
            email: email,
            nickname: nickname,
            gender: gender,
            birthDate: birthDate,
            diabetesType: diabetesType,
          });

          if (response.data.success) {
            // 회원 가입 성공
            Swal.fire({
              title: "회원 가입 성공",
              text: "회원 가입에 성공하셨습니다!!",
              icon: "success",
              confirmButtonText: "확인",
              allowOutsideClick: true,
              willClose: () => {
                window.location.href = "/login";
              },
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/login";
              }
            });
          }
        } catch (e) {
          // console.log(e);
          return Swal.fire({
            title: "회원가입 실패",
            text: "회원가입에 실패했습니다. 관리자에게 문의해주세요",
            icon: "error",
          });
        }
      }
      step++;
    });

  // 성별 선택
  genderDivs.forEach((i) => {
    i.addEventListener("click", (e) => {
      if (!i.disabled) {
        i.classList.add("gender-selected");
        genderDivs.forEach((item) => {
          if (i != item) item.classList.remove("gender-selected");
        });
      }
    });
  });

  // 생년월일 입력 제한
  birthDateInput.addEventListener("input", (event) => {
    const input = event.target;
    const filteredValue = input.value.replace(/[^0-9]/g, "");
    if (input.value !== filteredValue) {
      input.value = filteredValue;
    }
  });

  // 아이디 입력 제한
  // console.log(idInput);
  idInput.addEventListener("input", (event) => {
    const input = event.target;
    const filteredValue = input.value.replace(/[^a-zA-Z0-9]/g, "");
    if (input.value !== filteredValue) {
      input.value = filteredValue;
    }
  });

  // 아이디 중복검사 버튼
  idExistsButton.addEventListener("click", async () => {
    const userId = idInput.value;
    // 유효성 검사
    if (!isValidUserId(userId)) {
      // 경고창
      return Swal.fire({
        title: "아이디 규칙 위반",
        text: "아이디는 영어와 숫자 4~12글자로만 가능합니다.",
        icon: "error",
      });
    }

    // 중복검사 api
    try {
      const response = await axios.get("/api/users/exists/userid", {
        params: {
          userId: userId,
        },
      });
      const exists = response.data.data.exists;
      // console.log(exists);

      if (exists) {
        // 존재한단다 (새로 입력하게 하세요)
        return Swal.fire({
          title: "아이디 중복",
          text: "해당 아이디는 사용할 수 없습니다.",
          icon: "error",
        });
      } else {
        // 더이상 입력하지 못하게 막기
        idInput.disabled = true;
        idInput.style.backgroundColor = "whitesmoke";
        idInput.style.color = "darkgray";

        idExistsButton.disabled = true;
        idExistsButton.style.backgroundColor = "darkgray";
        return Swal.fire({
          title: "아이디 사용 가능",
          text: "해당 아이디는 사용할 수 있습니다.",
          icon: "success",
        });
      }
    } catch (e) {
      // 뭐냐 이건
      // console.log(e);
    }
  });

  // 이메일 중복검사 버튼
  emailExistsButton.addEventListener("click", async () => {
    const email = emailInput.value;
    // 유효성 검사
    if (!isValidEmail(email)) {
      // 경고창
      return Swal.fire({
        title: "이메일 규칙 위반",
        text: "옳바른 이메일을 입력해주세요",
        icon: "error",
      });
    }

    // 중복검사 api
    try {
      const response = await axios.get("/api/users/exists/email", {
        params: {
          email: email,
        },
      });
      const exists = response.data.data.exists;
      // console.log(exists);

      if (exists) {
        // 존재한단다 (새로 입력하게 하세요)
        return Swal.fire({
          title: "이메일 중복",
          text: "해당 이메일은 사용할 수 없습니다.",
          icon: "error",
        });
      } else {
        // 더이상 입력하지 못하게 막기
        emailInput.disabled = true;
        emailInput.style.backgroundColor = "whitesmoke";
        emailInput.style.color = "darkgray";

        emailExistsButton.disabled = true;
        emailExistsButton.style.backgroundColor = "darkgray";
        return Swal.fire({
          title: "이메일 사용 가능",
          text: "해당 이메일은 사용할 수 있습니다.",
          icon: "success",
        });
      }
    } catch (e) {
      // 뭐냐 이건
      // console.log(e);
    }
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//     const prevButton = document.getElementById("join-prev-button");
//     const nextButton = document.getElementById("join-next-button");
//     const targetDiv = document.getElementById("join-content");
//     const steps = [
//         "id",
//         "email",
//         "password",
//         "nickname",
//         "gender",
//         "birthDate",
//         "diabetesType",
//     ];
//     const stepDivStr = [
//         `<div id="id-content" class="new-content">
//             <input type="text" id="id-input" placeholder="아이디를 입력해주세요" maxlength="12">
//             <button id="id-exist-button">중복검사</button>
//         </div>`,
//         `<div id="email-content" class="new-content">
//             <input type="text" id="email-input" placeholder="이메일을 입력해주세요">
//             <button id="email-exist-button">중복검사</button>
//         </div>`,
//     ];
//     const stepDivs = [];
//     let step = 0;

//     // TODO : 회원이 들어오면 쫓아내도록

//     // 이전 버튼
//     prevButton.addEventListener("click", (e) => {
//         console.log("이전");

//         if (step == 0) {
//             // 뒤로 가라
//             history.back();
//         } else if (step == 1) {
//             // 아이디 삭제 (전단계 없음)
//         } else if (step == 2) {
//             // 이메일 삭제 (전단계 아이디)
//             const idInput = document.getElementById("id-input");
//             const idExistsButton = document.getElementById("id-exist-button");

//             idInput.disabled = true;
//             idInput.style.backgroundColor = "white";
//             idInput.style.color = "black";

//             idExistsButton.disabled = true;
//             idExistsButton.style.backgroundColor = "#FF5C5C";
//         }

//         console.log(stepDivs);
//         console.log(step - 1);
//         console.log(stepDivs[step - 1]);
//         stepDivs[step - 1].remove();
//         step--;
//         console.log("step : ", step);
//     });

//     // 다음 버튼
//     nextButton.addEventListener("click", (e) => {
//         console.log("다음");

//         if (step == 0) {
//             // 아이디
//             // 추가
//             targetDiv.insertAdjacentHTML("afterbegin", stepDivStr[step]);
//             // div저장
//             stepDivs[step] = document.getElementById("id-content");

//             // 아이디 입력 제한 (영어와 숫자만)
//             document
//                 .getElementById("id-input")
//                 .addEventListener("input", function (event) {
//                     var newValue = this.value.replace(/[^a-zA-Z0-9]/g, "");
//                     this.value = newValue;
//                 });

//             // 중복 검사 버튼
//             document
//                 .getElementById("id-exist-button")
//                 .addEventListener("click", async () => {
//                     const idInput = document.getElementById("id-input");
//                     const idExistsButton =
//                         document.getElementById("id-exist-button");
//                     const userId = idInput.value;
//                     // 유효성 검사
//                     if (!isValidUserId(userId)) {
//                         // 경고창
//                         return Swal.fire({
//                             title: "아이디 규칙 위반",
//                             text: "아이디는 영어와 숫자 4~12글자로만 가능합니다.",
//                             icon: "error",
//                         });
//                     }

//                     // 중복검사 api
//                     try {
//                         const response = await axios.get(
//                             "/api/users/exists/userid",
//                             {
//                                 params: {
//                                     userId: userId,
//                                 },
//                             }
//                         );
//                         const exists = response.data.data.exists;
//                         console.log(exists);

//                         if (exists) {
//                             // 존재한단다 (새로 입력하게 하세요)
//                             return Swal.fire({
//                                 title: "아이디 중복",
//                                 text: "해당 아이디는 사용할 수 없습니다.",
//                                 icon: "error",
//                             });
//                         } else {
//                             // 더이상 입력하지 못하게 막기
//                             idInput.disabled = true;
//                             idInput.style.backgroundColor = "whitesmoke";
//                             idInput.style.color = "darkgray";

//                             idExistsButton.disabled = true;
//                             idExistsButton.style.backgroundColor = "darkgray";
//                             return Swal.fire({
//                                 title: "아이디 사용 가능",
//                                 text: "해당 아이디는 사용할 수 있습니다.",
//                                 icon: "success",
//                             });
//                         }
//                     } catch (e) {
//                         // 뭐냐 이건
//                         console.log(e);
//                     }
//                 });
//         } else if (step == 1) {
//             // 이메일 (전단계 아이디)
//             // 아이디 사용 금지되었는지 확인
//             const idInput = document.getElementById("id-input");
//             console.log(stepDivs[step - 1]);
//             console.log(stepDivs[step - 1].disabled);
//             if (idInput.disabled == false) {
//                 // 응 아이디 먼저 중복검사 해야해
//                 return Swal.fire({
//                     title: "아이디 중복 검사",
//                     text: "아이디 중복 검사를 해주세요",
//                     icon: "error",
//                 });
//             }

//             // 추가
//             targetDiv.insertAdjacentHTML("afterbegin", stepDivStr[step]);
//             // div저장
//             stepDivs[step] = document.getElementById("email-content");
//             console.log(stepDivs);

//             // 중복 검사 버튼
//             document
//                 .getElementById("email-exist-button")
//                 .addEventListener("click", async () => {
//                     const emailInput = document.getElementById("email-input");
//                     const emailExistsButton =
//                         document.getElementById("email-exist-button");
//                     const email = emailInput.value;
//                     // 유효성 검사
//                     if (!isValidEmail(email)) {
//                         // 경고창
//                         return Swal.fire({
//                             title: "이메일 규칙 위반",
//                             text: "옳바른 이메일을 입력해주세요",
//                             icon: "error",
//                         });
//                     }

//                     // 중복검사 api
//                     try {
//                         const response = await axios.get(
//                             "/api/users/exists/email",
//                             {
//                                 params: {
//                                     email: email,
//                                 },
//                             }
//                         );
//                         const exists = response.data.data.exists;
//                         console.log(exists);

//                         if (exists) {
//                             // 존재한단다 (새로 입력하게 하세요)
//                             return Swal.fire({
//                                 title: "이메일 중복",
//                                 text: "해당 이메일은 사용할 수 없습니다.",
//                                 icon: "error",
//                             });
//                         } else {
//                             // 더이상 입력하지 못하게 막기
//                             emailInput.disabled = true;
//                             emailInput.style.backgroundColor = "whitesmoke";
//                             emailInput.style.color = "darkgray";

//                             emailExistsButton.disabled = true;
//                             emailExistsButton.style.backgroundColor =
//                                 "darkgray";
//                             return Swal.fire({
//                                 title: "이메일 사용 가능",
//                                 text: "해당 이메일은 사용할 수 있습니다.",
//                                 icon: "success",
//                             });
//                         }
//                     } catch (e) {
//                         // 뭐냐 이건
//                         console.log(e);
//                     }
//                 });
//         }

//         // 애니메이션 클래스 추가
//         const newContent = document.querySelector(".new-content");
//         newContent.classList.add("slide-down");

//         step++;
//         console.log("step : ", step);
//     });
// });

// const placeholders = [
//     "닉네임(4~20글자)",
//     "이메일",
//     "아이디(4~12글자)",
//     "비밀번호(8~16글자)",
//     "성별(남성/여성)",
//     "생년월일(예:1986-09-09)",
// ];
// const messages = [
//     "닉네임을 입력해주세요.",
//     "이메일을 입력해주세요.",
//     "아이디을 입력해주세요.",
//     "비밀번호를 입력해주세요.",
//     "성별을 알려주세요.",
//     "생년월일을 알려주세요.",
//     "가입완료되었습니다!",
// ];
// const join_db_list = [
//     "nickname",
//     "email",
//     "userId",
//     "password",
//     "gender",
//     "birthDate",
// ];
// const join_input_type = ["text", "email", "id", "password", "text", "text"];
// const url = "/api/users/";
// let userData = {};
// document.getElementById("back_button").addEventListener("click", function () {
//     window.history.go(-1);
// });
// //한 버튼에 여러 함수를 이용할 수 있도록하는 함
// function handleButtonClick(event) {
//     event.preventDefault(); // 기본 제출 동작 방지
//     // 제한 조건 확인
//     if (inputCount > 1) {
//         const index = inputCount - 2;
//         const currentInputText = placeholders[index];
//         const valStr = document.getElementById(join_db_list[index]).value;

//         if (currentInputText == "닉네임") {
//             // 닉네임 조건
//             if (valStr.length > 20 || valStr.length < 4) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "닉네임을 입력해주세요",
//                 });
//                 return;
//             }
//         } else if (currentInputText == "이메일") {
//             // 이메일 조건
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(valStr)) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "이메일을 입력해주세요",
//                 });
//                 return;
//             }
//         } else if (currentInputText == "아이디") {
//             if (valStr.length < 4 || valStr.length > 12) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "아이디를 입력해주세요",
//                 });
//                 return;
//             }
//         } else if (currentInputText === "비밀번호") {
//             if (valStr.length < 8 || valStr.length > 16) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "비밀번호를 입력해주세요",
//                 });
//                 return;
//             }
//         } else if (currentInputText == "성별") {
//             if (!["남성", "여성"].includes(valStr)) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "성별을 선택해주세요",
//                 });
//                 return;
//             }
//         } else if (currentInputText == "생년월일") {
//             const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//             if (!dateRegex.test(valStr)) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "생년월일을 입력해주세요",
//                 });
//                 return;
//             }
//         }
//     }

//     let check = addInput(event);
//     textChange(event);
//     focus();

//     if (!check) {
//         let userData = {
//             nickname: document.getElementById(join_db_list[0]).value,
//             email: document.getElementById(join_db_list[1]).value,
//             userId: document.getElementById(join_db_list[2]).value,
//             password: document.getElementById(join_db_list[3]).value,
//             gender: document.getElementById(join_db_list[4]).value,
//             birthDate: document.getElementById(join_db_list[5]).value,
//         };
//         console.log(userData);
//         postData(url, userData);
//         console.log("데이터 넘어감");
//     }
// }
// //post 정보 보내기
// async function postData(url, userData) {
//     try {
//         const response = await axios.post(url, userData);
//         console.log("Success:", response.userData);

//         //회원 가입 성공 (메인 페이지로 이동)
//         window.location.href = "/login";
//         console.log("넘어가기");
//     } catch (error) {
//         console.log("Error:", error);

//         //회원 가입 실패
//         Swal.fire({
//             icon: "error",
//             title: "회원가입 실패했습니다. 다시 확인해주세요.",
//         });
//     }
// }
// //email 버튼 함수
// async function duplication(email) {
//     // event.preventDefault(); // 기본 제출 동작 방지
//     checkEmail();
// }
// //email 중복검사
// function checkEmail() {
//     const eamilInput = document.getElementById("email");
//     console.log(eamilInput);
//     const email = document.getElementById("email").value;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 확인을 위한 정규 표현식

//     if (!emailRegex.test(email)) {
//         Swal.fire({
//             icon: "warning",
//             title: "유효한 이메일 형식을 입력하세요.",
//         });
//         return;
//     }

//     axios
//         .get("http://localhost:3000/api/users/exists/email", {
//             params: { email },
//         })
//         .then((response) => {
//             console.log(response.data.data.exists);
//             if (response.data.data.exists === true) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "이메일을 사용한 계정이 있습니다.",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "success",
//                     title: "사용가능한 이메일 입니다.",
//                 });
//                 eamilInput.disabled = true;
//             }
//         })
//         .catch((error) => {
//             console.log("Error:", error);
//         });
// }
// // id 중복 검사
// async function duplicationId(id) {
//     // event.preventDefault(); // 기본 제출 동작 방지
//     checkUserId();
// }
// // id 중복 검사 함수
// function checkUserId() {
//     const idInput = document.getElementById("userId");
//     const userId = document.getElementById("userId").value;

//     if (!userId) {
//         return next({
//             code: "VALIDATION_MISSING_FIELD",
//         });
//     }

//     axios
//         .get("http://localhost:3000/api/users/exists/userId", {
//             params: { userId },
//         })
//         .then((response) => {
//             if (response.data.data.exists) {
//                 Swal.fire({
//                     icon: "error",
//                     title: "중복된 ID가 있습니다.",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "success",
//                     title: "사용 가능한 ID입니다.",
//                 });
//                 idInput.disabled = true;
//             }
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });
// }
// // 화면이 구동되자마자 input 에 포커스가 맞춰짐
// window.onload = function () {
//     var input = document.getElementById("join_input");

//     // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
//     setTimeout(function () {
//         input.focus();
//     });
// };
// //새로운 input에 포커스가 맞춰짐
// window.onload = function () {
//     var input = document.getElementById("join_new");

//     var observer = new MutationObserver(function (mutations) {
//         mutations.forEach(function (mutation) {
//             mutation.addedNodes.forEach(function (node) {
//                 if (
//                     node.id === "join_new" &&
//                     node.tagName.toLowerCase() === "input"
//                 ) {
//                     // 키패드가 바로 뜨지 않을 경우를 대비해 약간의 딜레이를 줍니다.
//                     setTimeout(function () {
//                         node.focus();
//                         // 키패드를 확실히 띄우기 위해 input 이벤트를 트리거합니다.
//                         var event = new Event("input", { bubbles: true });
//                         node.dispatchEvent(event);
//                     }, 100);
//                 }
//             });
//         });
//     });

//     // 감시를 시작할 DOM 노드와 설정 옵션
//     var config = { childList: true, subtree: true };

//     // 감시할 대상 노드 설정 (document.body)
//     observer.observe(document.body, config);
// };

// // 버튼을 클릭할때마다 새로운 입력칸이 구현됨
// let formData = {};
// let placeholderIndex = 0;
// let join_db_index = 0;
// let joinInputTypeIndex = 0;
// const maxInput = 7;
// let inputCount = 1;

// function addInput(event) {
//     event.preventDefault(); // 기본 제출 동작 방지
//     if (inputCount < maxInput) {
//         const placeholder =
//             placeholders[placeholderIndex % placeholders.length];
//         const join_db_input = join_db_list[join_db_index % join_db_list.length];
//         const joinInputType =
//             join_input_type[joinInputTypeIndex % join_input_type.length]; // 동적 타입 지정

//         let newInputHTML = "";

//         if (joinInputType === "email") {
//             // joinInputType이 'userid' 또는 'email'일 때 다른 input 태그와 button 태그 생성
//             newInputHTML = `
//                 <br><br>
//                 <input type="text" placeholder="${placeholder}" id="${join_db_input}" class="join_new" name="${join_db_input}">
//                 <button type="button" onclick="duplication('${joinInputType}')">중복검사</button>
//                 <br>
//             `;
//         } else if (joinInputType === "id") {
//             newInputHTML = `
//                 <br><br>
//                 <input type="text" placeholder="${placeholder}" id="${join_db_input}" class="join_new" name="${join_db_input}">
//                 <button type="button" onclick="duplicationId('${joinInputType}')">중복검사</button>
//                 <br>
//             `;
//         } else {
//             // 일반 input 태그 생성
//             newInputHTML = `
//                 <br><br>
//                 <input type="${joinInputType}" placeholder="${placeholder}" id="${join_db_input}" class="join_new" name="${join_db_input}">
//                 <br>
//             `;
//         }
//         // h2 태그 바로 밑에 새로운 input 태그 추가
//         const h2Tag = document.getElementById("join_change");
//         h2Tag.insertAdjacentHTML("afterend", newInputHTML);

//         placeholderIndex++;
//         join_db_index++;
//         joinInputTypeIndex++;

//         inputCount++;
//         return true;
//     }
//     return false;
// }

// // 클릭할때마다 h태그가 바뀜
// const maxChange = 7;
// let changeCount = 1;
// function textChange(event) {
//     event.preventDefault();

//     if (changeCount < maxChange) {
//         const joinChange = document.getElementById("join_change");
//         const currentMessageIndex = messages.indexOf(joinChange.innerHTML);
//         const nextMessageIndex = (currentMessageIndex + 1) % messages.length;
//         joinChange.innerHTML = messages[nextMessageIndex];
//         changeCount++;
//     } else {
//         // changeCount가 maxChange를 넘으면 다른 페이지로 이동
//         // window.location.href = "/";
//     }
// }
