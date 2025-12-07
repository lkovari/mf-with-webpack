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

