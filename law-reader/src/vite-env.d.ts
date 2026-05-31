/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAW_OC: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
