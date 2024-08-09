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
      // console.log("Access token expired. Fetching new token...");
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

// 운동 칼로리 정보
const exerciseCalories = {
  걷기: 3.5,
  달리기: 9.8,
  자전거: 7.0,
  수영: 8.0,
  줄넘기: 12.0,
  계단오르기: 8.5,
  에어로빅: 6.0,
  근력운동: 4.5,
  요가: 4.0,
  필라테스: 5.0,
  테니스: 7.5,
  축구: 7.0,
  농구: 8.0,
  배드민턴: 6.0,
  볼링: 2.5,
  댄스: 7.0,
  탁구: 4.5,
  하이킹: 6.5,
  크로스핏: 9.5,
  체조: 5.5,
  스쿼시: 9.0,
  복싱: 10.0,
  자유웨이트: 6.0,
  사이클링: 8.0,
  롤러블레이딩: 7.0,
  킥복싱: 9.0,
  하키: 8.0,
  스키: 7.5,
  스노우보드: 6.5,
  서핑: 7.0,
  스쿼트: 5.0,
  유산소운동: 6.5,
  전신운동: 8.5,
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
  const backButton = document.getElementById("exercise-goback");
  // 저장 버튼
  const saveButton = document.getElementById("exercise-save");
  // 시간 요소
  const timePicker = document.getElementById("timepicker");
  const timeDisplay = document.getElementById("current-time");
  // 날짜 오소
  const calendar = document.getElementById("calendar");
  const calendarHeader = document.getElementById("calendar-header");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // 운동 정보 요소
  const exerciseSelect = document.getElementById("exercise");
  const durationInput = document.getElementById("duration");
  const caloriesDiv = document.getElementById("result");

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
  //   console.log("query :", data);

  // 쿼리 정보에 id가 있으면 해당 id정보를 받아온다
  if (data.el_id) {
    try {
      const response = await fetchGetWithRetry("/api/exercise-logs", {
        params: {
          el_id: data.el_id,
        },
        withCredentials: true,
      });
      const responseData = response.data.data.exercise_logs[0];
      //   console.log(responseData);
      // 시간 정보
      const current = getCurrentDateAndTime(responseData.record_time);
      data.date = current.date;
      data.time = current.time;
      // 혈당 및 다른 정보
      data.exercise_type = responseData.exercise_type;
      data.exercise_time = responseData.exercise_time;
      data.calories_burned = responseData.calories_burned;
      data.comments = responseData.comments;
    } catch (e) {
      // 정보를 못 받았다 (왜냐)
      Swal.fire({
        title: "정보 획득 실패",
        text: "관리자에게 문의 바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/";
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
  if (data.exercise_type != null) exerciseSelect.value = data.exercise_type;
  if (data.exercise_time != null) durationInput.value = data.exercise_time;
  // if (data.comments != null) commentstInupt.value = data.comments;
  calculateCalories();

  // 요소 기능
  // 저장하기
  saveButton.addEventListener("click", async (e) => {
    const exerciseType = exerciseSelect.value;
    const exerciseTime = durationInput.value;
    // const comments = commentstInupt.value;

    // 유효성 검사
    if (!exerciseType) {
      return Swal.fire({
        title: "기록 저장 오류",
        text: "운동을 선택해주세요",
        icon: "warning",
      });
    }
    if (!exerciseTime) {
      return Swal.fire({
        title: "기록 저장 오류",
        text: "운동 시간을 선택해주세요",
        icon: "warning",
      });
    }

    // 정보 문제가 없다면 저장하자!
    try {
      if (!data.el_id) {
        // 저장하기
        const response = await fetchPostWithRetry(
          "/api/exercise-logs",
          {
            exercise_type: exerciseType,
            exercise_time: exerciseTime,
            calories_burned: data.calories_burned,
            // comments: comments,
            record_time: `${data.date} ${data.time}:00`,
          },
          { withCredentials: true }
        );
        // console.log(response);
        return Swal.fire({
          title: "기록 저장 성공",
          text: "운동 기록이 저장되었습니다.",
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
          "/api/exercise-logs",
          {
            el_id: data.el_id,
            exercise_type: exerciseType,
            exercise_time: exerciseTime,
            calories_burned: data.calories_burned,
            // comments: comments,
            record_time: `${data.date} ${data.time}:00`,
          },
          { withCredentials: true }
        );
        // console.log(response);
        return Swal.fire({
          title: "기록 저장 성공",
          text: "운동 기록이 저장되었습니다.",
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

  // 칼로리 계산
  // 시간 입력시 자동으로 소모 칼로리 계산
  function calculateCalories() {
    const exercise = exerciseSelect.value;
    const duration = parseFloat(durationInput.value);

    // console.log(exercise, duration);
    if (!exercise || isNaN(duration) || duration <= 0) {
      return;
    }
    // console.log(exercise, duration);

    const caloriesPerMinute = exerciseCalories[exercise];
    const totalCalories = caloriesPerMinute * duration;

    // console.log(totalCalories);
    caloriesDiv.innerText = `소모 칼로리 : ${totalCalories.toFixed(2)} kcal`;

    // 칼로리 저장
    data.calories_burned = totalCalories;
  }
  durationInput.addEventListener("keyup", calculateCalories);
  exerciseSelect.addEventListener("change", calculateCalories);

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

// const selectElement = document.getElementById("exercise");
// const selectedValue = selectElement.value;
// let record_date = "";
// let record_time = "";

// document.getElementById("exercise-save").addEventListener("click", () => {
//     return Swal.fire({
//         title: "기록 저장 성공",
//         text: "운동 기록이 저장되었습니다.",
//         icon: "success",
//     });
// });

// // document.getElementById("exercise-save").addEventListener("click", async () => {
// //     // document.getElementById('my-select');
// //     // const selectedValue = selectElement.value; // 여기서 선택된 값을 가져옵니다.
// //     try {
// //         const response = await axios.post("/api/exercise-logs", {
// //             exercise_type: document.getElementById("exercise").value,
// //             exercise_time: document.getElementById("duration").value,
// //             calories_burned:
// //                 document.getElementById("result").textContent.split(" ")[3] ||
// //                 0, // 소모 칼로리 값 가져오기
// //             record_time: `${record_date} ${record_time}`,
// //             // 2024-07-24 09:00:00
// //         });
// //         const exercise = response.data.data; // API 응답에서 운동 데이터를 가져옴
// //         console.log("exercise success:", exercise); // 수정된 부분
// //         Swal.fire({
// //             icon: "success",
// //             title: "운동 기록이 성공적으로 저장되었습니다.",
// //         }); // 성공적으로 저장되었음을 알림
// //     } catch (error) {
// //         console.error("exercise error:", error); // 에러 로그를 콘솔에 출력
// //         Swal.fire({
// //             icon: "error",
// //             title: "운동 기록 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
// //         }); // 오류 알림
// //     }
// // });

// function formatDate(date) {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // 0부터 시작하므로 +1
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// }

// document.addEventListener("DOMContentLoaded", () => {
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
//     function displayCurrentTime() {
//         const now = new Date();
//         const hours = String(now.getHours()).padStart(2, "0");
//         const minutes = String(now.getMinutes()).padStart(2, "0");
//         const currentTimeString = `${hours}:${minutes}`;
//         document.getElementById("current-time").textContent = currentTimeString;

//         record_time = `${hours}:${minutes}:00`;
//     }

//     // 현재 시간 표시 초기 호출
//     displayCurrentTime();

//     window.calculateCalories = calculateCalories;
// });
