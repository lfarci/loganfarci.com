/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_REPOSITORY_URL?: string;
    readonly VITE_COMMIT_HASH?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
