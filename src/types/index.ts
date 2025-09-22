export interface Account {
  id: string;
  name: string;
  type: 'efectivo' | 'banco' | 'mercadopago' | 'otro';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface SavingsJar {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description?: string;
  deadline?: string;
  isActive: boolean;
  createdAt: string;
  icon?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
  category: 'ingreso' | 'gasto';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'ingreso' | 'gasto';
  amount: number;
  description: string;
  accountId: string;
  tagId: string;
  date: string;
  isRecurring: boolean;
  recurringConfig?: RecurringConfig;
  creditCardConfig?: CreditCardConfig;
  createdAt: string;
}

export interface RecurringConfig {
  frequency: 'diario' | 'semanal' | 'mensual' | 'anual';
  endDate?: string;
  occurrences?: number;
}

export interface CreditCardConfig {
  cardName: string;
  installments: number;
  currentInstallment: number;
  monthlyAmount: number;
}

export interface MonthlyProjection {
  month: string;
  projectedExpenses: number;
  actualExpenses: number;
  creditCardPayments: number;
  recurringPayments: number;
}
