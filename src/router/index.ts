import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue"),
  },
  {
    path: "/activity",
    name: "activity",
    component: () => import("../layout/index.vue"),
    redirect: "/activity/list",
    meta: {
      title: "活动管理",
      icon: "../assets/activity.svg",
      code: "ACTIVITY",
    },
    children: [
      {
        path: "list",
        name: "activity-list",
        component: () => import("../views/activity/list.vue"),
        meta: {
          title: "活动列表",
          code: "ACTIVITY-LIST",
        },
      },
      {
        path: "verify",
        name: "activity-verify",
        component: () => import("../views/activity/verify.vue"),
        meta: {
          title: "奖品核销",
          code: "ACTIVITY-VERIFY",
        },
      },
      {
        path: "new",
        name: "activity-new",
        component: () => import("../views/activity/new.vue"),
        meta: {
          title: "新增活动",
          code: "ACTIVITY-DETAIL",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/error",
    name: "error",
    component: () => import("../views/error.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/error",
    meta: {
      hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory('/backend/'),
  routes,
});

export default router;
