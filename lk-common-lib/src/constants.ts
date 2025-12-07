export const APP_NAME = 'Module Federation Demo';
export const APP_VERSION = '1.0.0';

export const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  dark: '#1f2937',
  light: '#f3f4f6'
} as const;

export const API_ENDPOINTS = {
  base: 'http://localhost:3000',
  users: '/api/users',
  posts: '/api/posts',
  auth: '/api/auth'
} as const;

export const MESSAGES = {
  loading: 'Loading...',
  success: 'Operation completed successfully',
  error: 'An error occurred',
  notFound: 'Resource not found'
} as const;

