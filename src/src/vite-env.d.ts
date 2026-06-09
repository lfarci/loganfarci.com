/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_REPOSITORY_URL?: string;
    readonly VITE_COMMIT_HASH?: string;
    readonly VITE_DEPLOYMENT_ENVIRONMENT?: string;
    readonly VITE_APPINSIGHTS_CONNECTION_STRING?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
