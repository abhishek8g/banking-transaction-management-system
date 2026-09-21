import api from './client';
import type { Transaction, PagedResponse } from '../types';

export const deposit = (accountId: number, amount: number) =>
  api.post<Transaction>('/transactions/deposit', { accountId, amount });

export const withdraw = (accountId: number, amount: number) =>
  api.post<Transaction>('/transactions/withdraw', { accountId, amount });

export const transfer = (sourceAccountId: number, destinationAccountId: number, amount: number, description?: string) =>
  api.post<Transaction>('/transactions/transfer', { sourceAccountId, destinationAccountId, amount, description });

export const getTransactions = (page = 0, size = 10, accountId?: number) => {
  const params = new URLSearchParams({ page: String(page), size: String(size), sortDir: 'desc' });
  if (accountId) params.append('accountId', String(accountId));
  return api.get<PagedResponse<Transaction>>(`/transactions?${params}`);
};

export const getTransactionByRef = (reference: string) =>
  api.get<Transaction>(`/transactions/${reference}`);
