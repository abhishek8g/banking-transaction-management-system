export interface User {
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  name?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  accountType: 'SAVINGS' | 'CHECKING';
  status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
  userId: number;
  userEmail: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  transactionReference: string;
  sourceAccountId?: number;
  sourceAccountNumber?: string;
  destinationAccountId?: number;
  destinationAccountNumber?: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description?: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface BalanceResponse {
  accountId: number;
  accountNumber: string;
  balance: number;
  currency: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}
