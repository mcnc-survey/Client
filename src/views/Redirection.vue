<template>
  <div>카카오 로그인 처리 중...</div>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      // 인증 코드를 서버로 전달하여 액세스 토큰 요청
      axios
        .post("/api/kakao/token", { code })
        .then((response) => {
          console.log("카카오 로그인 성공:", response.data);

          // 필요한 작업 수행
          this.$router.push("/web/management");
        })
        .catch((error) => {
          console.error("카카오 로그인 실패:", error);
        });
    } else {
      console.error("카카오 인증 코드가 없습니다.");
    }
  },
};
</script>
