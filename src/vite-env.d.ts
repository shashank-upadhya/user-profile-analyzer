/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_GITHUB_TOKEN: string;
    // Add other environment variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
