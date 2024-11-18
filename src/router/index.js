import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import SurveyManagement from "../views/SurveyManagement.vue";
import SurveyEdit from "../views/SurveyEdit.vue";
import SurveyStats from "../views/SurveyStats.vue";
import SurveyCreate from "../views/SurveyCreate.vue";
import SurveyCompletion from "../views/SurveyCompletion.vue";
import Calendar from "../views/Calendar.vue";
import DeletedItems from "../views/DeletedItems.vue";
import ParticipantInfo from "../mobile/ParticipantInfo.vue";
import SurveyParticipation from "../mobile/SurveyParticipation.vue";

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
    path: "/survey-management",
    component: SurveyManagement,
  },
  {
    path: "/survey-edit/:id",
    component: SurveyEdit,
    name: "SurveyEdit",
  },
  {
    path: "/survey-stats/:id",
    component: SurveyStats,
    name: "SurveyStats",
  },
  {
    path: "/survey-create",
    component: SurveyCreate,
    name: "SurveyCreate",
  },
  {
    path: "/survey-completion",
    component: SurveyCompletion,
  },
  {
    path: "/calendar",
    component: Calendar,
  },
  {
    path: "/deleted-items",
    component: DeletedItems,
  },
  {
    path: "/participant-info",
    component: ParticipantInfo,
  },
  {
    path: "/survey-participation",
    component: SurveyParticipation,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
