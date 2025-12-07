// !!! MODULE FEDERATION: TypeScript type declarations for remote modules
// These declarations tell TypeScript about the structure of federated modules
// Without these, TypeScript would show errors for dynamic imports of remotes

/**
 * Remote-A module type declaration
 * Maps to the './remoteApi' exposed module in webpack.remote.config.cjs
 */
declare module 'remoteApp/remoteApi' {
  export function renderRemoteMessage(containerId: string): void;
}

/**
 * Remote-B module type declaration
 * Maps to the './remoteContent' exposed module in webpack.remote-b.config.cjs
 */
declare module 'remoteBApp/remoteContent' {
  export function renderRemoteContent(containerId: string): void;
}

/**
 * !!! MODULE FEDERATION: Common Library type declarations
 * These declarations match the exposed modules in webpack.common-lib.config.cjs
 * Each declaration corresponds to one of the exposed paths
 */

/**
 * Common Library utilities module
 * Maps to './utils' exposed module
 */
declare module 'commonLib/utils' {
  export function formatDate(date: Date): string;
  export function capitalize(str: string): string;
  export function logger(message: string, level?: 'info' | 'warn' | 'error'): void;
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void;
  export function generateId(): string;
}

/**
 * Common Library constants module
 * Maps to './constants' exposed module
 */
declare module 'commonLib/constants' {
  export const APP_NAME: string;
  export const APP_VERSION: string;
  export const COLORS: {
    readonly primary: '#3b82f6';
    readonly secondary: '#8b5cf6';
    readonly success: '#10b981';
    readonly danger: '#ef4444';
    readonly warning: '#f59e0b';
    readonly info: '#06b6d4';
    readonly dark: '#1f2937';
    readonly light: '#f3f4f6';
  };
  export const API_ENDPOINTS: {
    readonly base: 'http://localhost:3000';
    readonly users: '/api/users';
    readonly posts: '/api/posts';
    readonly auth: '/api/auth';
  };
  export const MESSAGES: {
    readonly loading: 'Loading...';
    readonly success: 'Operation completed successfully';
    readonly error: 'An error occurred';
    readonly notFound: 'Resource not found';
  };
}

/**
 * Common Library types module
 * Maps to './types' exposed module
 */
declare module 'commonLib/types' {
  export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    createdAt?: Date;
    updatedAt?: Date;
  }
  export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
    timestamp?: string;
  }
  export type LogLevel = 'info' | 'warn' | 'error';
  export interface ModuleConfig {
    name: string;
    version: string;
    port: number;
    remoteUrl?: string;
  }
  export type CallbackFunction<T = void> = (data: T) => void;
}

/**
 * Common Library main entry point
 * Maps to './index' exposed module
 * This re-exports everything from utils, constants, and types
 * Use this for convenience when you need multiple exports
 */
declare module 'commonLib/index' {
  export * from 'commonLib/utils';
  export * from 'commonLib/constants';
  export * from 'commonLib/types';
}
