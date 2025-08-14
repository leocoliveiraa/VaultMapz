import { Timestamp } from "firebase/firestore";

export interface Transaction {
  id: string;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
  userId: string;
  createdAt: Date;
}

export interface FirestoreTransaction
  extends Omit<Transaction, "id" | "date" | "createdAt"> {
  date: Timestamp;
  createdAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export interface TransactionFormData {
  title: string;
  type: "income" | "expense";
  category: string;
  amount: string;
  description: string;
  date: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Record<string, number>;
}

export type TransactionType = "income" | "expense";

export interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}
