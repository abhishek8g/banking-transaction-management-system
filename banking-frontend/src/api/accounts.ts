import api from './client';
import type { Account, PagedResponse, BalanceResponse } from '../types';

export const getAccounts = (page = 0, size = 10) =>
  api.get<PagedResponse<Account>>(`/accounts?page=${page}&size=${size}&sortDir=desc`);

export const getAccountById = (id: number) =>
  api.get<Account>(`/accounts/${id}`);

export const getBalance = (id: number) =>
  api.get<BalanceResponse>(`/accounts/${id}/balance`);

export const createAccount = (accountType: string, initialDeposit: number) =>
  api.post<Account>('/accounts', { accountType, initialDeposit });

export const updateAccountStatus = (id: number, status: string) =>
  api.patch<Account>(`/accounts/${id}/status`, { status });

export const deleteAccount = (id: number) =>
  api.delete(`/accounts/${id}`);
