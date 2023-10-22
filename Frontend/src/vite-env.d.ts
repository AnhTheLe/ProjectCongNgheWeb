/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: undefined | string;
  readonly VITE_API_URL: string;
  readonly VITE_DEV_TOOLS: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
