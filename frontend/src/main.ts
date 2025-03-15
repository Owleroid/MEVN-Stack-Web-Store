import i18n from "./i18n";
import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import type { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

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

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(Toast, options);

app.mount("#app");
