import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import SurveyManagement from "../views/SurveyManagement.vue";
import SurveyEdit from "../views/SurveyEdit.vue";
import SurveyStats from "../views/SurveyStats.vue";
import SurveyCreate from "../views/SurveyCreate.vue";
import SurveyPreview from "../views/SurveyPreview.vue";
import SurveyCompletion from "../views/SurveyCompletion.vue";
import SurveyCalendar from "../views/SurveyCalendar.vue";
import DeletedItems from "../views/DeletedItems.vue";
import ParticipantInfo from "../mobile/ParticipantInfo.vue";
import SurveyParticipation from "../mobile/SurveyParticipation.vue";
import FindPwIdentify from "@/views/FindPwIdentify.vue";
import FindPwVerify from "@/views/FindPwVerify.vue";
import FindPwReset from "@/views/FindPwReset.vue";
import FindPwComplete from "@/views/FindPwComplete.vue";

import MobileLayout from "../layouts/MobileLayout.vue";
import WebLayout from "../layouts/WebLayout.vue";

const routes = [
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/",
    component: Login,
  },
  {
    path: "/web/preview",
    component: SurveyPreview,
    name: "SurveyPreview",
  },
  {
    path: "/help/identify",
    component: FindPwIdentify,
  },
  {
    path: "/help/verify",
    component: FindPwVerify,
  },
  {
    path: "/help/reset",
    component: FindPwReset,
  },
  {
    path: "/help/complete",
    component: FindPwComplete,
  },
  {
    path: "/preview",
    component: SurveyPreview,
    name: "SurveyPreview",
  },
  {
    path: "/web",
    component: WebLayout,
    children: [
      {
        path: "management",
        component: SurveyManagement,
        name: "SurveyManagement",
        meta: { title: '설문조사 목록' },
      },
      {
        path: "edit/:id",
        component: SurveyEdit,
        name: "SurveyEdit",
        meta: { title: '설문조사 수정' },
      },
      {
        path: "stats/:id",
        component: SurveyStats,
        name: "SurveyStats",
        meta: { title: '설문조사 통계' },
      },
      {
        path: "create",
        component: SurveyCreate,
        name: "SurveyCreate",
        meta: { title: '설문조사 생성' },
      },
      {
        path: "complete",
        component: SurveyCompletion,
        name: "SurveyCompletion",
        meta: { title: '설문조사 완료' },
      },
      {
        path: "calendar",
        component: SurveyCalendar,
        meta: { title: '캘린더' },
      },

      {
        path: "recycle",
        component: DeletedItems,
        name: "DeletedItems",
        meta: { title: '삭제된 항목' },
      },
    ],
  },
  {
    path: "/mobile",
    component: MobileLayout,
    children: [
      {
        path: "",
        component: ParticipantInfo,
      },
      {
        path: "completion",
        component: SurveyCompletion,
      },
      {
        path: "survey",
        component: SurveyParticipation,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
