import { createI18n } from "vue-i18n";

import enNavbar from "./locales/en/navbar.json";
import enAddToCartButton from "./locales/en/addToCartButton.json";
import enCartHoover from "./locales/en/cartHoover.json";
import enCartView from "./locales/en/cartView.json";
import enLoginView from "./locales/en/loginView.json";
import enSignupView from "./locales/en/signupView.json";
import enPasswordResetView from "./locales/en/passwordResetView.json";
import enStoreView from "./locales/en/storeView.json";

import ruNavbar from "./locales/ru/navbar.json";
import ruAddToCartButton from "./locales/ru/addToCartButton.json";
import ruCartHoover from "./locales/ru/cartHoover.json";
import ruCartView from "./locales/ru/cartView.json";
import ruLoginView from "./locales/ru/loginView.json";
import ruSignupView from "./locales/ru/signupView.json";
import ruPasswordResetView from "./locales/ru/passwordResetView.json";
import ruStoreView from "./locales/ru/storeView.json";

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
  },
};

const i18n = createI18n({
  locale: sessionStorage.getItem("language") || "en", // set locale from sessionStorage or default to 'en'
  messages,
});

export default i18n;
