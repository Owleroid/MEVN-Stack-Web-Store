import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

import { useAuthStore } from "@/stores/authStore";

import { getUserLocation, getUserRegion } from "@/services/geolocationService";
import { getCategoryBySlug } from "@/services/categoryService";

import HomeView from "@/views/HomeView.vue";
import CollectionsListView from "@/views/CollectionsListView.vue";
import CollectionProductsView from "@/views/CollectionProductsView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import AboutView from "@/views/AboutView.vue";
import ContactView from "@/views/ContactView.vue";
import NewsView from "@/views/NewsView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

import CartView from "@/views/user/CartView.vue";
import CheckoutView from "@/views/user/CheckoutView.vue";

import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import PasswordResetView from "@/views/PasswordResetView.vue";
import UserOrdersView from "@/views/user/UserOrdersView.vue";
import UserSettingsView from "@/views/user/UserSettingsView.vue";

import AdminPanelView from "@/views/admin/PanelView.vue";
import AdminCategoriesView from "@/views/admin/CategoriesView.vue";
import AdminProductsView from "@/views/admin/ProductsView.vue";
import AdminOrdersView from "@/views/admin/OrdersView.vue";
import AdminWarehouseView from "@/views/admin/WarehouseView.vue";
import AdminImageManagerView from "@/views/admin/ImageManagerView.vue";
import AdminClientsView from "@/views/admin/ClientsView.vue";
import AdminAnnouncementsView from "@/views/admin/AnnouncementsView.vue";
import AdminNewsView from "@/views/admin/NewsView.vue";
import AdminSupportView from "@/views/admin/SupportView.vue";
import AdminDiscountsView from "@/views/admin/DiscountsView.vue";

const protectedPaths = [
  "about",
  "contact",
  "news",
  "cart",
  "orders",
  "settings",
  "checkout",
  "login",
  "signup",
  "password-reset",
  "admin",
  "collections",
];

const validSlugPattern = "[a-z0-9-]+";

const routes = [
  { path: "/", component: HomeView },
  { path: "/login", component: LoginView },
  { path: "/signup", component: SignupView },
  { path: "/password-reset", component: PasswordResetView },
  {
    path: "/collections",
    component: CollectionsListView,
  },
  {
    path: "/not-found",
    name: "NotFound",
    component: NotFoundView,
  },
  {
    path: `/:slug(${validSlugPattern})`,
    name: "Collection",
    component: CollectionProductsView,
    props: true,
    beforeEnter: async (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const slug = to.params.slug as string;

      if (protectedPaths.includes(slug)) {
        next("/not-found");
        return;
      }

      try {
        const response = await getCategoryBySlug(slug);
        if (response.success && response.category) {
          next();
        } else {
          next("/not-found");
        }
      } catch (error) {
        console.error("Error validating category:", error);
        next("/not-found");
      }
    },
  },
  {
    path: `/:categorySlug(${validSlugPattern})/:productSlug(${validSlugPattern})`,
    name: "ProductDetail",
    component: ProductDetailView,
    props: true,
    meta: {
      title: "Product Detail",
    },
    beforeEnter: async (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const categorySlug = to.params.categorySlug as string;
      const productSlug = to.params.productSlug as string;

      if (protectedPaths.includes(categorySlug)) {
        next("/not-found");
        return;
      }

      try {
        const { getProductBySlug } = await import("@/services/productService");
        const response = await getProductBySlug(productSlug, categorySlug);

        if (response.success && !response.redirectNeeded) {
          next();
        } else {
          next("/not-found");
        }
      } catch (error) {
        console.error("Error validating product:", error);
        next("/not-found");
      }
    },
  },
  { path: "/about", component: AboutView },
  { path: "/contact", component: ContactView },
  { path: "/news", component: NewsView },
  { path: "/cart", component: CartView },
  { path: "/orders", component: UserOrdersView, meta: { requiresAuth: true } },
  {
    path: "/settings",
    component: UserSettingsView,
    meta: { requiresAuth: true },
  },
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
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "products",
        name: "AdminProducts",
        component: AdminProductsView,
        meta: { requiresAuth: true, requiresAdmin: true },
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
      {
        path: "discounts",
        name: "AdminDiscounts",
        component: AdminDiscountsView,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "image-manager",
        name: "AdminImageManager",
        component: AdminImageManagerView,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      { path: "clients", component: AdminClientsView },
      {
        path: "support",
        name: "admin-support",
        component: AdminSupportView,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      {
        path: "announcements",
        name: "admin-announcements",
        component: AdminAnnouncementsView,
        meta: { requiresAuth: true, requiresAdmin: true },
      },
      { path: "news", component: AdminNewsView },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/not-found",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication, admin access, and user location
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    // Log warning for deprecated routes
    if (to.meta.deprecated) {
      console.warn(
        `The route "${to.path}" is deprecated and may be removed in the future.`
      );
    }

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

    const isAuthenticated =
      sessionStorage.getItem("isAuthenticated") === "true";
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";

    if (to.meta.requiresAuth && !isAuthenticated) {
      next("/login");
    } else if (to.meta.requiresAdmin && !isAdmin) {
      next("/");
    } else {
      next();
    }
  }
);

export default router;
