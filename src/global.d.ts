/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly VITE_WEBSOCKET: string
  readonly VITE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}