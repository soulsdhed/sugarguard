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
    if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
      // console.log("Access token expired. Fetching new token...");
      await refreshAccessToken();
      return fetchGetWithRetry(url, options, retries - 1);
    } else {
      throw e;
    }
  }
};
// 재시도를 포함한 post fetch
const fetchPostWithRetry = async (
  url,
  data = {},
  options = {},
  retries = 1
) => {
  try {
    const response = await axios.post(url, data, options);
    return response;
  } catch (e) {
    if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
      console.log("Access token expired. Fetching new token...");
      await refreshAccessToken();
      return fetchPostWithRetry(url, data, options, retries - 1);
    } else {
      throw e;
    }
  }
};
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
    if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
      // console.log("Access token expired. Fetching new token...");
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
    if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
      // console.log("Access token expired. Fetching new token...");
      await refreshAccessToken();
      return fetchPatchWithRetry(url, data, options, retries - 1);
    } else {
      throw e;
    }
  }
};

// 현재 날짜와 시간 정보 받아오기
function getCurrentDateAndTime(dateTimeString = null) {
  const now = dateTimeString ? new Date(dateTimeString) : new Date();

  // 날짜를 yyyy-mm-dd 형식으로 변환
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${year}-${month}-${day}`;

  // 시간을 hh:mm 형식으로 변환
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  // console.log(time);
  return { date, time };
}

// 날짜와 시간을 표시하는 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 로딩 창 띄우기
const showLoading = () => {
  let title = "AI 이미지 분석중...";
  let text = "칼로리를 계산 중입니다...";
  Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// 로딩 창 닫기
const hideLoading = () => {
  Swal.close();
};

// 전체 유저 데이타
const data = {};
document.addEventListener("DOMContentLoaded", async () => {
  // 넌적스 템플릿으로부터 userId 가져오기 (로그인 여부 확인)
  const userId = window.userIdFromTemplate;
  // 로그인 되어 있지 않으면 로그인 화면으로
  if (!userId) {
    return (window.location.href = "/sugardiary");
  }

  // 뒤로 가기 버튼
  const backButton = document.getElementById("meal-goback");
  // 저장 버튼
  const saveButton = document.getElementById("meal-save");
  // 시간 요소
  const timePicker = document.getElementById("timepicker");
  const timeDisplay = document.getElementById("current-time");
  // 날짜 오소
  const calendar = document.getElementById("calendar");
  const calendarHeader = document.getElementById("calendar-header");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // 식사 정보 요소
  const mealTypeDivs = document.querySelectorAll("#time-meal a");
  const mealInfoInput = document.getElementById("eat-memo");
  const mealPhotoDiv = document.getElementById("photoDiv");
  const mealPhotoImg = document.getElementById("photo");
  const mealPhotoicon = document.querySelector("#photoDiv i");
  const mealPhotoInput = document.getElementById("fileInput");
  const caloriesInput = document.getElementById("duration");
  const calculateKcalButton = document.getElementById("calc-kcal");
  const medicationInput = document.getElementById("medication-memo");

  // 날짜 정보와 시간 받아오기
  const { date, time } = getCurrentDateAndTime();
  data.date = date;
  data.time = time;

  // 쿼리 정보 가져오기
  // 쿼리 스트링 분리
  const urlParams = new URLSearchParams(window.location.search);
  // 쿼리 스트링을 객체로 변환 (만약 date가 존재하면 덮어씌워질거다)
  urlParams.forEach((value, key) => {
    data[key] = value;
  });
  // console.log("query :", data);

  // 쿼리 정보에 id가 있으면 해당 id정보를 받아온다
  if (data.ml_id) {
    try {
      const response = await fetchGetWithRetry("/api/meal-logs", {
        params: {
          ml_id: data.ml_id,
        },
        withCredentials: true,
      });
      const responseData = response.data.data.meal_logs[0];
      // 시간 정보
      const current = getCurrentDateAndTime(responseData.record_date);
      data.date = current.date;
      // 시간은 최신화 되면 곤란
      // data.time = current.time;
      // 식사 및 다른 정보
      data.meal_time = responseData.meal_time;
      data.meal_info = responseData.meal_info;
      data.calories = responseData.calories;
      data.photo_url = responseData.photo_url;
      data.medication = responseData.medication;
      data.comments = responseData.comments;
    } catch (e) {
      // console.log(e);
      // 정보를 못 받았다 (왜냐)
      Swal.fire({
        title: "정보 획득 실패",
        text: "관리자에게 문의 바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          // window.location.href = "/";
        }
      });
    }
  }
  // console.log("axios :", data);

  // 날짜 표시
  generateCalendar(new Date(data.date));
  // 시간 표시
  timeDisplay.textContent = data.time;
  timePicker.value = data.time;

  // 기록 데이터에 받아온 데이터 입력
  if (data.meal_time != null) {
    const matchingDiv = Array.from(mealTypeDivs).find(
      (i) => i.getAttribute("data-info") === data.meal_time
    );
    matchingDiv.classList.add("active");
  }
  if (data.meal_info != null) mealInfoInput.value = data.meal_info;
  if (data.photo_url != null) updatePhoto(data.photo_url);
  if (data.calories != null) caloriesInput.value = data.calories;
  if (data.medication != null) medicationInput.medication = data.medication;
  // if (data.comments != null) commentstInupt.value = data.comments;

  // 요소 기능
  // 저장하기
  saveButton.addEventListener("click", async (e) => {
    const mealTime = data.meal_time;
    const mealInfo = mealInfoInput.value;
    const photoUrl = data.photo_url;
    const calories = caloriesInput.value;
    const medication = medicationInput.value;
    // const comments = commentstInupt.value;

    // console.log(mealTime, mealInfo, photoUrl, calories, medication);

    // 유효성 검사
    if (!mealTime) {
      return Swal.fire({
        title: "기록 저장 오류",
        text: "식사 종류를 입력해주세요",
        icon: "warning",
      });
    }
    if (!calories) {
      return Swal.fire({
        title: "기록 저장 오류",
        text: "칼로리를 입력해주세요",
        icon: "warning",
      });
    }

    // 정보 문제가 없다면 저장하자!
    try {
      if (!data.ml_id) {
        // 저장하기
        const response = await fetchPostWithRetry(
          "/api/meal-logs",
          {
            meal_time: mealTime,
            meal_info: mealInfo,
            photo_url: photoUrl,
            calories: calories,
            medication: medication,
            // comments: comments,
            record_date: data.date,
          },
          { withCredentials: true }
        );
        // console.log(response);
        return Swal.fire({
          title: "기록 저장 성공",
          text: "식사 기록이 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          willClose: () => {
            window.location.href = `/sugardiary?date=${data.date}`;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/sugardiary?date=${data.date}`;
          }
        });
      } else {
        // 수정하기
        const response = await fetchPatchWithRetry(
          "/api/meal-logs",
          {
            ml_id: data.ml_id,
            meal_time: mealTime,
            meal_info: mealInfo,
            photo_url: photoUrl,
            calories: calories,
            medication: medication,
            // comments: comments,
            record_date: data.date,
          },
          { withCredentials: true }
        );
        // console.log(response);
        return Swal.fire({
          title: "기록 저장 성공",
          text: "식사 기록이 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          willClose: () => {
            window.location.href = `/sugardiary?date=${data.date}`;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/sugardiary?date=${data.date}`;
          }
        });
      }
    } catch (e) {
      // console.log(e);
      return Swal.fire({
        title: "기록 저장 실패",
        text: "관리자에게 문의해주세요.",
        icon: "error",
      });
    }
  });

  // 칼로리 계산 버튼
  calculateKcalButton.addEventListener("click", async () => {
    // photo url이 없는 경우
    if (data.photo_url == null) {
      return Swal.fire({
        title: "사진 업로드",
        text: "사진을 먼저 업로드 해주세요",
        icon: "warning",
      });
    }
    // console.log(data.photo_url);
    // 계산
    // 로딩창 띄우기
    showLoading();
    try {
      const response = await fetchPostWithRetry(
        "/api/meal-logs/food-calories",
        {
          photo_url: data.photo_url,
        },
        {
          withCredentials: true,
        }
      );
      // console.log(response);

      // 결과값을 각각 배치
      caloriesInput.value = response.data.data.food_detection.calories;
      mealInfoInput.value = response.data.data.food_detection.foodname;
    } catch (e) {
      // ?
      // console.log(e);
      return Swal.fire({
        title: "칼로리 계산 실패",
        text: "관리자에게 문의해주세요",
        icon: "warning",
      });
    }
    // 로딩창 닫기
    hideLoading();
  });

  // 사진 업로드
  function updatePhoto(url) {
    mealPhotoImg.src = url;
    mealPhotoImg.style.display = "block";
    mealPhotoDiv.style.backgroundColor = "white";
    mealPhotoicon.style.display = "none";
  }
  mealPhotoDiv.addEventListener("click", () => {
    mealPhotoInput.click();
  });
  mealPhotoInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    // 파일이 있다면
    if (file) {
      // 업로드 요청
      try {
        // presigned URL 요청
        const res = await fetchPostWithRetry(
          "/api/auth/upload-image/meal-log",
          {
            fileName: file.name,
            fileType: file.type,
          },
          {
            withCredentials: true,
          }
        );

        // presigned URL 받기
        const { key, url } = res.data.data;

        // S3에 파일 업로드
        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // url 저장
        data.photo_url = key;

        // 사진 보여주기
        const reader = new FileReader();
        reader.onload = function (e) {
          updatePhoto(e.target.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        // console.log(err);
        Swal.fire("사진 업로드 실패", "관리자에게 문의해주세요", "error");
      }
    }

    // 다시 열릴 수 있도록
    event.target.value = "";
  });

  // 식사 시간(타입) 선택
  mealTypeDivs.forEach((a) => {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      mealTypeDivs.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      // console.log(this.getAttribute("data-info"));
      data.meal_time = this.getAttribute("data-info");
    });
  });

  // 뒤로 가기
  backButton.addEventListener("click", (e) => {
    history.back();
    // window.location.href = "/sugardiary";
  });

  // TimePicker
  timeDisplay.addEventListener("click", () => {
    timePicker.style.display = "block";
    timeDisplay.style.display = "none";
    timePicker.focus();
    timePicker.click();
  });
  timePicker.addEventListener("blur", function () {
    timePicker.style.display = "none";
    timeDisplay.style.display = "block";
  });
  timePicker.addEventListener("change", function () {
    const selectedTime = timePicker.value;
    timeDisplay.textContent = selectedTime;
    timePicker.style.display = "none";
    timeDisplay.style.display = "block";
  });

  // 캘린더
  function updateHeader(date) {
    const options = { year: "numeric", month: "long" };
    calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
  }

  function generateCalendar(selectedDate) {
    calendar.innerHTML = ""; // 기존 캘린더 내용 제거

    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      if (date.toDateString() === selectedDate.toDateString()) {
        dayDiv.classList.add("selected");
      }
      dayDiv.innerHTML = `${date.getDate()}<br>${daysOfWeek[date.getDay()]}`;
      dayDiv.addEventListener("click", () => {
        generateCalendar(date); // 새로운 날짜 생성
        updateHeader(date); // 헤더 업데이트
      });
      calendar.appendChild(dayDiv);
    }
    updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
    // 데이터 업데이트
    data.date = formatDate(selectedDate);
  }

  // 로딩화면 제거
  document.getElementById("loading-screen").style.display = "none";
});

// let formattedTime, formattedDate;
// function formatDate(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// }

// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("meal-save").addEventListener("click", () => {
//         return Swal.fire({
//             title: "기록 저장 성공",
//             text: "식사 기록이 저장되었습니다.",
//             icon: "success",
//         });
//     });

//     // URL 파라미터에서 날짜를 가져오는 함수
//     function getParameterByName(name) {
//         const urlParams = new URLSearchParams(window.location.search);
//         return urlParams.get(name);
//     }

//     // URL 파라미터로 전달된 날짜를 받아옵니다.
//     const dateParam = getParameterByName("date");
//     let currentDate = new Date(); // 현재 날짜로 초기화
//     if (dateParam) {
//         currentDate = new Date(dateParam);
//     }

//     const calendar = document.getElementById("calendar");
//     const calendarHeader = document.getElementById("calendar-header");
//     const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//     function updateHeader(date) {
//         const options = { year: "numeric", month: "long" };
//         calendarHeader.textContent = date.toLocaleDateString("ko-KR", options);
//     }

//     function generateCalendar(selectedDate) {
//         calendar.innerHTML = ""; // 기존 캘린더 내용 제거

//         const startDate = new Date(selectedDate);
//         startDate.setDate(startDate.getDate() - Math.floor(7 / 2)); // 선택된 날짜를 중앙에 배치

//         for (let i = 0; i < 7; i++) {
//             const date = new Date(startDate);
//             date.setDate(startDate.getDate() + i);

//             const dayDiv = document.createElement("div");
//             dayDiv.classList.add("day");
//             if (date.toDateString() === selectedDate.toDateString()) {
//                 dayDiv.classList.add("selected");
//             }
//             dayDiv.innerHTML = `${date.getDate()}<br>${
//                 daysOfWeek[date.getDay()]
//             }`;
//             dayDiv.addEventListener("click", () => {
//                 generateCalendar(date); // 새로운 날짜 생성
//                 updateHeader(date); // 헤더 업데이트
//             });
//             calendar.appendChild(dayDiv);
//         }
//         updateHeader(selectedDate); // 선택된 날짜로 헤더 업데이트
//         record_date = formatDate(selectedDate);
//         formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

//         // console.log(record_date);
//         // console.log(record_time);
//     }

//     // Infinite scroll logic
//     let isLoading = false;

//     function handleScroll() {
//         if (isLoading) return;

//         const container = document.getElementById("calendar-container");
//         const { scrollLeft, scrollWidth, clientWidth } = container;

//         if (scrollLeft + clientWidth >= scrollWidth - 10) {
//             // 스크롤이 오른쪽 끝에 가까워지면 다음 날짜 로드
//             isLoading = true;
//             loadNextDays();
//             setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
//         } else if (scrollLeft <= 10) {
//             // 스크롤이 왼쪽 끝에 가까워지면 이전 날짜 로드
//             isLoading = true;
//             loadPreviousDays();
//             setTimeout(() => (isLoading = false), 1000); // Prevent rapid calls
//         }
//     }

//     document
//         .getElementById("calendar-container")
//         .addEventListener("scroll", handleScroll);

//     // 초기화
//     generateCalendar(currentDate);

//     // 현재 시간 표시 함수
//     // function displayCurrentTime() {
//     //     const now = new Date();
//     //     const hours = String(now.getHours()).padStart(2, "0");
//     //     const minutes = String(now.getMinutes()).padStart(2, "0");
//     //     const currentTimeString = `${hours}:${minutes}`;
//     //     document.getElementById("current-time").textContent = currentTimeString;

//     //     record_time = `${hours}:${minutes}:00`;
//     // }
//     // displayCurrentTime();

//     // // // 현재 시간 표시 초기 호출
//     // const now = new Date();
//     // // 왼쪽 시간나타내는거
//     // window.addEventListener("DOMContentLoaded", (event) => {
//     //     // 날짜와 시간을 포맷에 맞게 설정
//     //     const hours = String(now.getHours()).padStart(2, "0");
//     //     const minutes = String(now.getMinutes()).padStart(2, "0");
//     //     const seconds = String(now.getSeconds()).padStart(2, "0");
//     //     // 날짜와 시간 입력 필드에 설정
//     //     document.getElementById("time").value = `${hours}:${minutes}`;
//     //     formattedTime = `${hours}:${minutes}:${seconds}`;

//     //     // 선택하고 저장 버튼을 누를 때 기록목록에 기록이 남기는 곳
//     //     document
//     //         .getElementById("mealrecord-button")
//     //         .addEventListener("click", async function () {
//     //             const mealType =
//     //                 document.querySelector("#time-meal a.active")
//     //                     ?.textContent || "선택되지 않음";
//     //             const mealInfo =
//     //                 document.getElementById("meal-information").value;
//     //             const medicineInfo = document.querySelector(
//     //                 "#medicine-information input"
//     //             ).value;
//     //             const specialInfo = document.getElementById(
//     //                 "special-information"
//     //             ).value;

//     //             if (!mealInfo) {
//     //                 alert("식사 정보를 입력해 주세요.");
//     //                 return;
//     //             }

//     //             // 콘솔에 기록 남기기
//     //             console.log(
//     //                 `기록:${recordDateTime1} ${mealType.trim()} 식사 정보:${mealInfo}
//     //             약정보:${medicineInfo} 특이사항:${specialInfo}`
//     //             );

//     //             const recordItem = document.createElement("li");
//     //             recordItem.textContent = `${recordDateTime1} ${mealType}식사 정보:${mealInfo} 약정보:${medicineInfo} 특이사항:${specialInfo}`;

//     //             // 입력 필드 초기화
//     //             document.getElementById("meal-information").value = "";
//     //             document.querySelector("#medicine-information input").value =
//     //                 "";
//     //             document
//     //                 .querySelectorAll("#time-meal a")
//     //                 .forEach((a) => a.classList.remove("active"));
//     //             var recordDateTime1 = formattedDate +" "+ formattedTime;
//     //             console.log(recordDateTime1);

//     //             // API POST
//     //             async function postData() {
//     //                 // toISOString().slice(0, 19).replace("T", " ");
//     //                 console.log(recordDateTime1);
//     //                 try {
//     //                     const response = await axios.post("/api/meal-logs", {
//     //                         record_date: recordDateTime1,
//     //                         meal_time: mealType.trim(),
//     //                         medication: medicineInfo,
//     //                         meal_info: mealInfo,
//     //                         comments: specialInfo,
//     //                         //     // ml_id: "",
//     //                         //     // member_id: "",
//     //                         //     // calories: "",
//     //                     });
//     //                     console.log(response.data);
//     //                 } catch (err) {
//     //                     console.error(`ErrorMessage :${err}`);
//     //                 }
//     //             }

//     //             await postData();
//     //         });
//     // });

//     // Edit date and time buttons
//     // document
//     //     .getElementById("edit-date-button")
//     //     .addEventListener("click", () => editDateTime("date"));
//     // document
//     //     .getElementById("edit-time-button")
//     //     .addEventListener("click", () => editDateTime("time"));

//     // Update from input fields
//     // document
//     //     .getElementById("dateInput")
//     //     .addEventListener("change", () => updateFromInput("date"));
//     // document
//     //     .getElementById("timeInput")
//     //     .addEventListener("change", () => updateFromInput("time"));

//     function formatDateTime(dateString) {
//         const date = new Date(dateString);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");
//         const hours = String(date.getHours()).padStart(2, "0");
//         const minutes = String(date.getMinutes()).padStart(2, "0");
//         const seconds = String(date.getSeconds()).padStart(2, "0");
//         return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     }
// });
