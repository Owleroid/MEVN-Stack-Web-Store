import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { getUserLocation, getUserRegion } from "../services/geolocationService";

import HomeView from "../views/HomeView.vue";
import StoreView from "../views/StoreView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import NewsView from "../views/NewsView.vue";
import NotFoundView from "../views/NotFoundView.vue";

import CartView from "../views/CartView.vue";
import CheckoutView from "../views/CheckoutView.vue";

import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import PasswordResetView from "../views/PasswordResetView.vue";

import AdminPanelView from "../views/admin/AdminPanelView.vue";

import AdminCategoriesView from "../views/admin/categories/AdminCategoriesView.vue";
import AdminAddCategoryView from "../views/admin/categories/AdminAddCategoryView.vue";
import AdminEditCategoryView from "../views/admin/categories/AdminEditCategoryView.vue";

import AdminProductsView from "../views/admin/products/AdminProductsView.vue";
import AdminAddProductView from "../views/admin/products/AdminAddProductView.vue";
import AdminEditProductView from "../views/admin/products/AdminEditProductView.vue";

import AdminOrdersView from "../views/admin/orders/AdminOrdersView.vue";

import AdminWarehouseView from "../views/admin/AdminWarehouseView.vue";
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
  { path: "/cart", component: CartView },
  {
    path: "/checkout",
    name: "Checkout",
    component: CheckoutView,
  },
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
      {
        path: "warehouse",
        name: "AdminWarehouse",
        component: AdminWarehouseView,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "orders",
        name: "AdminOrders",
        component: AdminOrdersView,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
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

// Navigation guard to check authentication, admin access, and user location
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Check if user region is already stored in session
  let region = getUserRegion();
  if (!region) {
    // Fetch user location and store region in session
    const location = await getUserLocation();
    region = location ? location.country_code : "EU";
    authStore.userRegion = region || "EU";
  }

  // Set currency and language based on user region if not already set
  if (!authStore.currency || !authStore.language) {
    if (region === "RU") {
      authStore.currency = "rubles";
      authStore.language = "ru";
    } else {
      authStore.currency = "euros";
      authStore.language = "en";
    }
    sessionStorage.setItem("currency", authStore.currency);
    sessionStorage.setItem("language", authStore.language);
  }

  // Set the language for the application
  document.documentElement.lang = authStore.language;

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
