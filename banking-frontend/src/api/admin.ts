import api from './client';
import type { PagedResponse, UserResponse } from '../types';

export const getAllUsers = (page = 0, size = 10) =>
  api.get<PagedResponse<UserResponse>>(`/admin/users?page=${page}&size=${size}`);

export const getUserById = (id: number) =>
  api.get<UserResponse>(`/admin/users/${id}`);
