import { createI18n } from "vue-i18n";
import { ref } from "vue";

export const translationsLoaded = ref(false); // Global loading state

export const loadLocaleMessages = async (locale: string) => {
  const modules = import.meta.glob("./locales/**/*.json", { eager: true }); // Eagerly load modules
  const messages: Record<string, any> = {};

  for (const path in modules) {
    if (path.includes(`.${locale}.json`)) {
      try {
        const module = modules[path] as { default: Record<string, any> }; // Access the module directly
        Object.assign(messages, module.default); // Flatten keys
      } catch (error) {
        console.error(`Failed to load translation file: ${path}`, error);
      }
    }
  }

  return messages;
};

const i18n = createI18n({
  legacy: false,
  locale: sessionStorage.getItem("language") || "en", // Initialize with persisted language
  fallbackLocale: "en",
  messages: {}, // Initially empty, will be populated dynamically
});

// Dynamically load messages for the current locale
(async () => {
  const locale = sessionStorage.getItem("language") || "en";
  const messages = await loadLocaleMessages(locale);

  i18n.global.setLocaleMessage(locale, messages);

  // Preload fallback locale messages
  if (locale !== "en") {
    const fallbackMessages = await loadLocaleMessages("en");
    i18n.global.setLocaleMessage("en", fallbackMessages);
  }

  translationsLoaded.value = true; // Mark translations as loaded
})();

export default i18n;
