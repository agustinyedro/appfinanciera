import { defineStore } from 'pinia'
import { db } from '@/services/sqlite'
import type { Account, SavingsJar, Tag, Transaction } from '@/types'

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    isInitialized: false,
    accounts: [] as Account[],
    savingsJars: [] as SavingsJar[],
    tags: [] as Tag[],
    transactions: [] as Transaction[],
  }),
  getters: {
    totalBalance(state): number {
      return state.accounts.reduce((sum, account) => sum + account.balance, 0)
    },
    totalSavings(state): number {
      return state.savingsJars.reduce((sum, jar) => sum + jar.currentAmount, 0)
    },
    monthlyIncome(state): number {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return state.transactions
        .filter(t => {
          const date = new Date(t.date)
          return t.type === 'ingreso' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)
    },
    monthlyExpenses(state): number {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return state.transactions
        .filter(t => {
          const date = new Date(t.date)
          return t.type === 'gasto' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)
    },
    activeAccounts(state): Account[] {
      return state.accounts.filter(a => a.isActive)
    },
    monthlyExpensesByCategory(state): { value: number, name: string, itemStyle: { color: string } }[] {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const expenses = state.transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === 'gasto' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const expensesByTag = expenses.reduce((acc, t) => {
        const tag = state.tags.find(tag => tag.id === t.tagId);
        if (tag) {
          if (!acc[tag.id]) {
            acc[tag.id] = { name: tag.name, value: 0, color: tag.color };
          }
          acc[tag.id].value += t.amount;
        }
        return acc;
      }, {} as Record<string, { name: string, value: number, color: string }>);

      return Object.values(expensesByTag).map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color: item.color
        }
      }));
    },
    historicalIncomeExpense(state): { labels: string[], income: number[], expenses: number[] } {
      const labels: string[] = [];
      const income: number[] = [];
      const expenses: number[] = [];
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const month = d.getMonth();
        const year = d.getFullYear();
        
        labels.push(`${monthNames[month]} ${year.toString().slice(-2)}`);

        const monthlyTransactions = state.transactions.filter(t => {
          const date = new Date(t.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });

        income.push(monthlyTransactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0));
        expenses.push(monthlyTransactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0));
      }

      return { labels, income, expenses };
    }
  },
  actions: {
    async init() {
      if (this.isInitialized) return
      await db.init()
      await this.fetchAll()
      this.isInitialized = true
    },
    async fetchAll() {
      this.accounts = await db.getAllAccounts()
      this.savingsJars = await db.getAllSavingsJars()
      this.tags = await db.getAllTags()
      this.transactions = await db.getAllTransactions()
    },
    
    // Account actions
    async addAccount(account: Omit<Account, 'id' | 'createdAt'>) {
      await db.addAccount(account)
      await this.fetchAll()
    },
    async updateAccount(id: string, updates: Partial<Account>) {
      await db.updateAccount(id, updates)
      await this.fetchAll()
    },
    async deleteAccount(id: string) {
      await db.deleteAccount(id)
      await this.fetchAll()
    },

    // SavingsJar actions
    async addSavingsJar(jar: Omit<SavingsJar, 'id' | 'createdAt'>) {
      await db.addSavingsJar(jar)
      await this.fetchAll()
    },
    async updateSavingsJar(id: string, updates: Partial<SavingsJar>) {
      await db.updateSavingsJar(id, updates)
      await this.fetchAll()
    },
    async deleteSavingsJar(id: string) {
      await db.deleteSavingsJar(id)
      await this.fetchAll()
    },

    // Tag actions
    async addTag(tag: Omit<Tag, 'id' | 'createdAt'>) {
      await db.addTag(tag)
      await this.fetchAll()
    },
    async updateTag(id: string, updates: Partial<Tag>) {
      await db.updateTag(id, updates)
      await this.fetchAll()
    },
    async deleteTag(id: string) {
      await db.deleteTag(id)
      await this.fetchAll()
    },

    // Transaction actions
    async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
      await db.addTransaction(transaction)
      await this.fetchAll()
    },
    async updateTransaction(id: string, updates: Partial<Transaction>) {
      await db.updateTransaction(id, updates)
      await this.fetchAll()
    },
    async deleteTransaction(id: string) {
      await db.deleteTransaction(id)
      await this.fetchAll()
    },
  }
})
