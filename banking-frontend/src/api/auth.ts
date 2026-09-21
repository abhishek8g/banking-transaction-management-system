import api from './client';
import type { AuthResponse, UserResponse } from '../types';

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

export const register = (name: string, email: string, password: string, role = 'CUSTOMER') =>
  api.post<UserResponse>('/auth/register', { name, email, password, role });
