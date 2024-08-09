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
// // 재시도를 포함한 patch fetch
// const fetchPatchWithRetry = async (url, data = {}, options = {}, retries = 1) => {
//     try {
//         const response = await axios.patch(url, data, options);
//         return response;
//     } catch (e) {
//         if (e.response.data.error.code === "AUTH_EXPIRED_TOKEN" && retries > 0) {
//             console.log("Access token expired. Fetching new token...");
//             await refreshAccessToken();
//             return fetchPatchWithRetry(url, data, options, retries - 1);
//         } else {
//             throw e;
//         }
//     }
// }

// 페이지 실행
document.addEventListener("DOMContentLoaded", async (e) => {
  // 넌적스 템플릿으로부터 userId 가져오기 (로그인 여부 확인)
  const userId = window.userIdFromTemplate;

  // 로그인 상태면
  if (userId) {
    // 혈당
    try {
      const response = await fetchGetWithRetry("/api/blood-sugar-logs/recent", {
        withCredentials: true,
      });
      if (response.data.data.count > 0) {
        // console.log(response.data.data.blood_sugar_logs[0].blood_sugar);
        document.querySelector("#mypage-blood-sugar-div h1").textContent =
          response.data.data.blood_sugar_logs[0].blood_sugar || 0;
      }
      // console.log(response.data.data);
    } catch (e) {
      // console.log("error", e);
      location.reload();
    }
    // 운동
    try {
      const response = await fetchGetWithRetry("/api/exercise-logs/recent", {
        withCredentials: true,
      });
      if (response.data.data.count > 0) {
        // console.log(response.data.data.exercise_logs[0].calories_burned);
        document.querySelector("#mypage-exercise-div h1").textContent =
          response.data.data.exercise_logs[0].calories_burned || 0;
      }
    } catch (e) {
      // console.log("error", e);
      location.reload();
    }
    // 식사
    try {
      const response = await fetchGetWithRetry("/api/meal-logs/recent", {
        withCredentials: true,
      });
      if (response.data.data.count > 0) {
        // console.log(response.data.data.meal_logs[0].calories);
        document.querySelector("#mypage-meal-div h1").textContent =
          response.data.data.meal_logs[0].calories || 0;
      }
    } catch (e) {
      // console.log("error", e);
      location.reload();
    }
    // 체중
    try {
      const response = await fetchGetWithRetry("/api/weight-logs/recent", {
        withCredentials: true,
      });
      if (response.data.data.count > 0) {
        // console.log(response.data.data.weight_logs[0].weight);
        document.querySelector("#mypage-weight-div h1").textContent =
          parseFloat(
            Number(response.data.data.weight_logs[0].weight).toFixed(2)
          ) || 0;
      }
    } catch (e) {
      // console.log("error", e);
      location.reload();
    }
    // 혈압
    try {
      const response = await fetchGetWithRetry(
        "/api/blood-pressure-logs/recent",
        {
          withCredentials: true,
        }
      );
      if (response.data.data.count > 0) {
        // console.log(
        //     response.data.data.blood_pressure_logs[0].blood_pressure_min
        // );
        // console.log(
        //     response.data.data.blood_pressure_logs[0].blood_pressure_max
        // );
        document.querySelector(
          "#mypage-blood-pressure-div h1"
        ).textContent = `${
          response.data.data.blood_pressure_logs[0].blood_pressure_min || 0
        }~${response.data.data.blood_pressure_logs[0].blood_pressure_max || 0}`;
      }
    } catch (e) {
      // console.log("error", e);
      location.reload();
    }

    // Element
    // 뒤로 가기 버튼
    document.getElementById("mypage-goback").addEventListener("click", (e) => {
      // history.back();
      // 여기선 메인으로
      window.location.href = "/";
    });

    // element 이벤트 연결 : 해당 부분이 안에 있을 경우 생길 수 있는 문제가 있다
    // chart 링크
    const urls = [
      "/report/blood-sugar",
      "/report/exercise",
      "/report/meal",
      "/report/weight",
      "/report/blood-pressure",
    ];
    // 각 차트 event 연결
    document.querySelectorAll(".mypage_blood").forEach((element, index) => {
      element.addEventListener("click", (e) => {
        window.location.href = urls[index];
      });
    });

    // 회원 정보 수정 버튼
    document
      .getElementById("mypage-modity-button")
      .addEventListener("click", (e) => {
        window.location.href = "/modify";
      });

    // 로그아웃 버튼
    document
      .getElementById("mypage-logout-button")
      .addEventListener("click", (e) => {
        // 한번 더 물어보기
        Swal.fire({
          title: "로그아웃",
          text: "로그아웃하시겠습니까?",
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
            // 로그아웃 api 연결
            try {
              const res = await axios.post(
                "/api/users/logout",
                {},
                {
                  withCredentials: true,
                }
              );
              // console.log(res);
              location.reload();
            } catch (e) {
              Swal.fire(
                "에러 발생",
                "에러가 발생했습니다. 관리자에게 문의해주세요.",
                "error"
              );
            }
          }
        });
      });
  }

  // 로딩화면 제거
  document.getElementById("loading-screen").style.display = "none";
});
