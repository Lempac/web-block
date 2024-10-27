import { Config } from 'ziggy-js';

export enum VisibilityType {
    Public = 'public',
    Private = 'private',
}

export interface Project {
    name: string;
    description: string;
    visibility: VisibilityType
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    env: {
        APP_NAME: string;
        GITHUB_CLIENT_REDIRECT: string;
    };
    ziggy: Config & { location: string };
};
