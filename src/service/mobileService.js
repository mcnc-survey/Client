import axios from "./mobileAxios";

export const API = {
  // sendVerificationCode(email) {
  //   return axios.post("auth/verify", { email });
  // },
  submitParticipantInfo(data) {
    return axios.post(
      "auth/sign?t=YzNiYzE5YTYtYmM0My00ZmRlLWI5Y2QtMDM1MGU3MmYwNDk1",
      data
    );
  },
};
