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
      },
      {
        path: "edit/:id",
        component: SurveyEdit,
        name: "SurveyEdit",
      },
      {
        path: "stats/:id",
        component: SurveyStats,
        name: "SurveyStats",
      },
      {
        path: "create",
        component: SurveyCreate,
        name: "SurveyCreate",
      },
      {
        path: "complete",
        component: SurveyCompletion,
        name: "SurveyCompletion",
      },
      {
        path: "calendar",
        component: SurveyCalendar,
      },

      {
        path: "recycle",
        component: DeletedItems,
        name: "DeletedItems",
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
