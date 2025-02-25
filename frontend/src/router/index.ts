import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import PasswordResetView from "../views/PasswordResetView.vue";
import StoreView from "../views/StoreView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import NewsView from "../views/NewsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

import AdminPanelView from "../views/admin/AdminPanelView.vue";

import AdminCategoriesView from "../views/admin/categories/AdminCategoriesView.vue";
import AdminAddCategoryView from "../views/admin/categories/AdminAddCategoryView.vue";
import AdminEditCategoryView from "../views/admin/categories/AdminEditCategoryView.vue";

import AdminProductsView from "../views/admin/products/AdminProductsView.vue";
import AdminAddProductView from "../views/admin/products/AdminAddProductView.vue";
import AdminEditProductView from "../views/admin/products/AdminEditProductView.vue";

import AdminWarehouseView from "../views/admin/AdminWarehouseView.vue";
import AdminOrdersView from "../views/admin/AdminOrdersView.vue";
import AdminClientsView from "../views/admin/AdminClientsView.vue";
import AdminNewsView from "../views/admin/AdminNewsView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/signup", component: SignupView },
  { path: "/password-reset", component: PasswordResetView },
  { path: "/categories", component: StoreView },
  { path: "/about", component: AboutView },
  { path: "/contact", component: ContactView },
  { path: "/news", component: NewsView },
  {
    path: "/admin",
    component: AdminPanelView,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "categories",
        name: "AdminCategories",
        component: AdminCategoriesView,
        children: [
          {
            path: "add",
            name: "AddCategory",
            component: AdminAddCategoryView,
            meta: { requiresAuth: true, requiresAdmin: true },
          },
          {
            path: "edit/:id",
            name: "EditCategory",
            component: AdminEditCategoryView,
            meta: { requiresAuth: true, requiresAdmin: true },
          },
        ],
      },
      {
        path: "products",
        name: "AdminProducts",
        component: AdminProductsView,
        children: [
          {
            path: "add/:categoryId",
            name: "AddProduct",
            component: AdminAddProductView,
            meta: { requiresAuth: true, requiresAdmin: true },
          },
          {
            path: "edit/:id",
            name: "EditProduct",
            component: AdminEditProductView,
            meta: { requiresAuth: true, requiresAdmin: true },
          },
        ],
      },
      { path: "warehouse", component: AdminWarehouseView },
      { path: "orders", component: AdminOrdersView },
      { path: "clients", component: AdminClientsView },
      { path: "news", component: AdminNewsView },
    ],
  },
  { path: "/:pathMatch(.*)*", component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication and admin access
router.beforeEach((to, _from, next) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next("/");
  } else {
    next();
  }
});

export default router;
