import { createI18n } from "vue-i18n";

// General Components
import enNavbar from "./locales/components/general/Navbar.en.json";
import ruNavbar from "./locales/components/general/Navbar.ru.json";
import enAddToCartButton from "./locales/components/general/AddToCartButton.en.json";
import ruAddToCartButton from "./locales/components/general/AddToCartButton.ru.json";
import enCartHoover from "./locales/components/general/CartHoover.en.json";
import ruCartHoover from "./locales/components/general/CartHoover.ru.json";

// Admin Components
import enAdminNavbar from "./locales/components/admin/AdminNavbar.en.json";
import ruAdminNavbar from "./locales/components/admin/AdminNavbar.ru.json";
import enAddCategoryModal from "./locales/components/admin/categories/AddCategoryModal.en.json";
import ruAddCategoryModal from "./locales/components/admin/categories/AddCategoryModal.ru.json";
import enDeleteCategoryModal from "./locales/components/admin/categories/DeleteCategoryModal.en.json";
import ruDeleteCategoryModal from "./locales/components/admin/categories/DeleteCategoryModal.ru.json";
import enEditCategoryModal from "./locales/components/admin/categories/EditCategoryModal.en.json";
import ruEditCategoryModal from "./locales/components/admin/categories/EditCategoryModal.ru.json";
import enReassignCategoryModal from "./locales/components/admin/categories/ReassignCategoryModal.en.json";
import ruReassignCategoryModal from "./locales/components/admin/categories/ReassignCategoryModal.ru.json";
import enAddEditProductModal from "./locales/components/admin/products/AddEditProductModal.en.json";
import ruAddEditProductModal from "./locales/components/admin/products/AddEditProductModal.ru.json";
import enChangeCategoryModal from "./locales/components/admin/products/ChangeCategoryModal.en.json";
import ruChangeCategoryModal from "./locales/components/admin/products/ChangeCategoryModal.ru.json";
import enAddProductFields from "./locales/components/admin/orders/AddProductFields.en.json";
import ruAddProductFields from "./locales/components/admin/orders/AddProductFields.ru.json";
import enEditOrderModal from "./locales/components/admin/orders/EditOrderModal.en.json";
import ruEditOrderModal from "./locales/components/admin/orders/EditOrderModal.ru.json";
import enOrderTable from "./locales/components/admin/orders/OrderTable.en.json";
import ruOrderTable from "./locales/components/admin/orders/OrderTable.ru.json";
import enAddWarehouseModal from "./locales/components/admin/warehouses/AddWarehouseModal.en.json";
import ruAddWarehouseModal from "./locales/components/admin/warehouses/AddWarehouseModal.ru.json";
import enDeleteWarehouseModal from "./locales/components/admin/warehouses/DeleteWarehouseModal.en.json";
import ruDeleteWarehouseModal from "./locales/components/admin/warehouses/DeleteWarehouseModal.ru.json";

// User Views
import enCartView from "./locales/views/user/CartView.en.json";
import ruCartView from "./locales/views/user/CartView.ru.json";
import enCheckoutView from "./locales/views/user/CheckoutView.en.json";
import ruCheckoutView from "./locales/views/user/CheckoutView.ru.json";
import enUserOrdersView from "./locales/views/user/UserOrdersView.en.json";
import ruUserOrdersView from "./locales/views/user/UserOrdersView.ru.json";
import enUserSettingsView from "./locales/views/user/UserSettingsView.en.json";
import ruUserSettingsView from "./locales/views/user/UserSettingsView.ru.json";

// Auth Views
import enLoginView from "./locales/views/LoginView.en.json";
import ruLoginView from "./locales/views/LoginView.ru.json";
import enSignupView from "./locales/views/SignupView.en.json";
import ruSignupView from "./locales/views/SignupView.ru.json";
import enPasswordResetView from "./locales/views/PasswordResetView.en.json";
import ruPasswordResetView from "./locales/views/PasswordResetView.ru.json";

// Store Views
import enStoreView from "./locales/views/StoreView.en.json";
import ruStoreView from "./locales/views/StoreView.ru.json";

// Admin Views
import enCategoriesView from "./locales/views/admin/CategoriesView.en.json";
import ruCategoriesView from "./locales/views/admin/CategoriesView.ru.json";
import enOrdersView from "./locales/views/admin/OrdersView.en.json";
import ruOrdersView from "./locales/views/admin/OrdersView.ru.json";
import enProductsView from "./locales/views/admin/ProductsView.en.json";
import ruProductsView from "./locales/views/admin/ProductsView.ru.json";
import enWarehouseView from "./locales/views/admin/WarehouseView.en.json";
import ruWarehouseView from "./locales/views/admin/WarehouseView.ru.json";

const messages = {
  en: {
    navbar: enNavbar,
    addToCartButton: enAddToCartButton,
    cartHoover: enCartHoover,
    cartView: enCartView,
    loginView: enLoginView,
    signupView: enSignupView,
    passwordResetView: enPasswordResetView,
    storeView: enStoreView,
    checkoutView: enCheckoutView,
    userOrdersView: enUserOrdersView,
    userSettingsView: enUserSettingsView,
    adminNavbar: enAdminNavbar,
    adminCategoriesView: enCategoriesView,
    adminOrdersView: enOrdersView,
    adminProductsView: enProductsView,
    adminWarehouseView: enWarehouseView,
    addCategoryModal: enAddCategoryModal,
    deleteCategoryModal: enDeleteCategoryModal,
    editCategoryModal: enEditCategoryModal,
    reassignCategoryModal: enReassignCategoryModal,
    addEditProductModal: enAddEditProductModal,
    changeCategoryModal: enChangeCategoryModal,
    addProductFields: enAddProductFields,
    editOrderModal: enEditOrderModal,
    orderTable: enOrderTable,
    addWarehouseModal: enAddWarehouseModal,
    deleteWarehouseModal: enDeleteWarehouseModal,
  },
  ru: {
    navbar: ruNavbar,
    addToCartButton: ruAddToCartButton,
    cartHoover: ruCartHoover,
    cartView: ruCartView,
    loginView: ruLoginView,
    signupView: ruSignupView,
    passwordResetView: ruPasswordResetView,
    storeView: ruStoreView,
    checkoutView: ruCheckoutView,
    userOrdersView: ruUserOrdersView,
    userSettingsView: ruUserSettingsView,
    adminNavbar: ruAdminNavbar,
    adminCategoriesView: ruCategoriesView,
    adminOrdersView: ruOrdersView,
    adminProductsView: ruProductsView,
    adminWarehouseView: ruWarehouseView,
    addCategoryModal: ruAddCategoryModal,
    deleteCategoryModal: ruDeleteCategoryModal,
    editCategoryModal: ruEditCategoryModal,
    reassignCategoryModal: ruReassignCategoryModal,
    addEditProductModal: ruAddEditProductModal,
    changeCategoryModal: ruChangeCategoryModal,
    addProductFields: ruAddProductFields,
    editOrderModal: ruEditOrderModal,
    orderTable: ruOrderTable,
    addWarehouseModal: ruAddWarehouseModal,
    deleteWarehouseModal: ruDeleteWarehouseModal,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: sessionStorage.getItem("language") || "en",
  messages,
});

export default i18n;
