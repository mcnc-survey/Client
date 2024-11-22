import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 라우터 가져오기
import { setupCalendar } from 'v-calendar'; //캘린더 가져오기
import 'v-calendar/style.css';

const app = createApp(App);
app.use(router); // 라우터 등록
app.use(setupCalendar, {});
app.mount("#app");
