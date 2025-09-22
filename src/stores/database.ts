import { defineStore } from 'pinia'
import { db } from '@/services/sqlite'
import type { Account, SavingsJar, Tag, Transaction } from '@/types'

type ChartDataItem = { value: number, name: string, itemStyle: { color: string } };

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
    
    // Chart Getters
    getCategorizedDataForPeriod(state): (type: 'ingreso' | 'gasto', year: number, month: number) => ChartDataItem[] {
      return (type: 'ingreso' | 'gasto', year: number, month: number) => {
        const filteredTransactions = state.transactions.filter(t => {
          const date = new Date(t.date);
          return t.type === type && date.getFullYear() === year && date.getMonth() === month;
        });

        const dataByTag = filteredTransactions.reduce((acc, t) => {
          const tag = state.tags.find(tag => tag.id === t.tagId);
          if (tag) {
            if (!acc[tag.id]) {
              acc[tag.id] = { name: tag.name, value: 0, color: tag.color };
            }
            acc[tag.id].value += t.amount;
          }
          return acc;
        }, {} as Record<string, { name: string, value: number, color: string }>);

        return Object.values(dataByTag).map(item => ({
          value: parseFloat(item.value.toFixed(2)),
          name: item.name,
          itemStyle: {
            color: item.color
          }
        }));
      }
    },
    getHistoricalIncomeExpense(state): (months: number) => { labels: string[], income: number[], expenses: number[] } {
      return (months: number) => {
        const labels: string[] = [];
        const income: number[] = [];
        const expenses: number[] = [];
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        for (let i = months - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(1);
          d.setMonth(d.getMonth() - i);
          const month = d.getMonth();
          const year = d.getFullYear();
          
          labels.push(`${monthNames[month]} '${year.toString().slice(-2)}`);

          const monthlyTransactions = state.transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === month && date.getFullYear() === year;
          });

          income.push(parseFloat(monthlyTransactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0).toFixed(2)));
          expenses.push(parseFloat(monthlyTransactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0).toFixed(2)));
        }

        return { labels, income, expenses };
      }
    }
  },
  actions: {
    async init() {
      if (this.isInitialized) return
      await db.init()
      this.fetchAll()
      this.isInitialized = true
    },
    fetchAll() {
      this.accounts = db.getAllAccounts()
      this.savingsJars = db.getAllSavingsJars()
      this.tags = db.getAllTags()
      this.transactions = db.getAllTransactions()
    },
    
    // Account actions
    addAccount(account: Omit<Account, 'id' | 'createdAt'>) {
      db.addAccount(account)
      this.fetchAll()
    },
    updateAccount(id: string, updates: Partial<Account>) {
      db.updateAccount(id, updates)
      this.fetchAll()
    },
    deleteAccount(id: string) {
      db.deleteAccount(id)
      this.fetchAll()
    },

    // SavingsJar actions
    addSavingsJar(jar: Omit<SavingsJar, 'id' | 'createdAt'>) {
      db.addSavingsJar(jar)
      this.fetchAll()
    },
    updateSavingsJar(id: string, updates: Partial<SavingsJar>) {
      db.updateSavingsJar(id, updates)
      this.fetchAll()
    },
    deleteSavingsJar(id: string) {
      db.deleteSavingsJar(id)
      this.fetchAll()
    },

    // Tag actions
    addTag(tag: Omit<Tag, 'id' | 'createdAt'>) {
      db.addTag(tag)
      this.fetchAll()
    },
    updateTag(id: string, updates: Partial<Tag>) {
      db.updateTag(id, updates)
      this.fetchAll()
    },
    deleteTag(id: string) {
      db.deleteTag(id)
      this.fetchAll()
    },

    // Transaction actions
    addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>) {
      db.addTransaction(transaction)
      this.fetchAll()
    },
    updateTransaction(id: string, updates: Partial<Transaction>) {
      db.updateTransaction(id, updates)
      this.fetchAll()
    },
    deleteTransaction(id: string) {
      db.deleteTransaction(id)
      this.fetchAll()
    },
  }
})
