interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CART_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
