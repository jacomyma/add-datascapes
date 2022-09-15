import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/doc/:id",
      name: "doc",
      component: () => import("../views/DocView.vue"),
    },
    {
      path: "/help",
      name: "help",
      component: () => import("../views/Help.vue"),
    },
  ],
});

export default router;
