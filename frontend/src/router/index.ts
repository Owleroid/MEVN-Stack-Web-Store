import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import PasswordResetView from "../views/PasswordResetView.vue";
import CategoriesView from "../views/StoreView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import NewsView from "../views/NewsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/signup", component: SignupView },
    { path: "/password-reset", component: PasswordResetView },
    { path: "/categories", component: CategoriesView },
    { path: "/about", component: AboutView },
    { path: "/contact", component: ContactView },
    { path: "/news", component: NewsView },
    { path: "/:pathMatch(.*)*", component: NotFoundView },
  ],
});

// Navigation guard to check authentication
router.beforeEach((to, _from, next) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
