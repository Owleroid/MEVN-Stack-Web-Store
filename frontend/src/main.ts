import i18n from "./i18n";
import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import "vue-toastification/dist/index.css";
import type { PluginOptions } from "vue-toastification";

import App from "./App.vue";
import router from "./router";

const options: PluginOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  hideProgressBar: true,
  rtl: false,
};

const vueTelInputOptions = {
  mode: "international",
  validCharactersOnly: true,
  autoFormat: true,
  showDialCodeInSelection: true,
  showFlags: true,
  inputOptions: {
    placeholder: "",
  },
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Toast, options);
app.use(VueTelInput, vueTelInputOptions);

app.mount("#app");
