import { defineStore } from 'pinia'
import { db } from '@/services/sqlite'
import type { Account, SavingsJar, SavingsJarTransaction, Tag, Transaction } from '@/types'

type ChartDataItem = { value: number, name: string, itemStyle: { color: string } };

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    isInitialized: false,
    accounts: [] as Account[],
    savingsJars: [] as SavingsJar[],
    savingsJarTransactions: [] as SavingsJarTransaction[],
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
          if (!t.date) return false;
          const txDate = new Date(t.date + 'T12:00:00'); // Use noon to avoid timezone shifts
          return t.type === 'ingreso' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)
    },
    monthlyExpenses(state): number {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      return state.transactions
        .filter(t => {
          if (!t.date) return false;
          const txDate = new Date(t.date + 'T12:00:00'); // Use noon to avoid timezone shifts
          return t.type === 'gasto' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)
    },
    activeAccounts(state): Account[] {
      return state.accounts.filter(a => a.isActive)
    },
    
    // Chart Getters
    getMonthlyBalance(state): (year: number, month: number) => { income: number, expense: number } {
      return (year: number, month: number) => {
        const monthlyTransactions = state.transactions.filter(t => {
          if (!t.date) return false;
          const txDate = new Date(t.date + 'T12:00:00'); // Use noon to avoid timezone shifts
          return txDate.getFullYear() === year && txDate.getMonth() === month;
        });
        const income = monthlyTransactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
        const expense = monthlyTransactions.filter(t => t.type === 'gasto').reduce((sum, t) => sum + t.amount, 0);
        return { income, expense };
      }
    },
    getCategorizedDataForPeriod(state): (type: 'ingreso' | 'gasto', year: number, month: number) => ChartDataItem[] {
      return (type: 'ingreso' | 'gasto', year: number, month: number) => {
        const filteredTransactions = state.transactions.filter(t => {
          if (!t.date) return false;
          const txDate = new Date(t.date + 'T12:00:00'); // Use noon to avoid timezone shifts
          return t.type === type && txDate.getFullYear() === year && txDate.getMonth() === month;
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
    getCategoryRanking(state): (type: 'ingreso' | 'gasto', months: number) => { months: string[], categories: string[], series: any[] } {
      return (type, months) => {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const dataByMonth: Record<string, { category: string, total: number }[]> = {};
        const allCategories: Set<string> = new Set();

        for (let i = months - 1; i >= 0; i--) {
          const d = new Date();
          d.setDate(1);
          d.setMonth(d.getMonth() - i);
          const month = d.getMonth();
          const year = d.getFullYear();
          const monthKey = `${monthNames[month]} '${year.toString().slice(-2)}`;

          const monthlyTransactions = state.transactions.filter(t => {
            if (!t.date) return false;
            const txDate = new Date(t.date + 'T12:00:00'); // Use noon to avoid timezone shifts
            return t.type === type && txDate.getMonth() === month && txDate.getFullYear() === year;
          });

          const totals = monthlyTransactions.reduce((acc, t) => {
            const tagName = state.tags.find(tag => tag.id === t.tagId)?.name || 'Sin Categoría';
            acc[tagName] = (acc[tagName] || 0) + t.amount;
            return acc;
          }, {} as Record<string, number>);

          const ranked = Object.entries(totals)
            .sort(([, a], [, b]) => b - a)
            .map(([category], index) => ({ category, rank: index + 1, total: totals[category] }));
          
          dataByMonth[monthKey] = ranked.map(r => ({ category: r.category, total: r.total }));
          ranked.forEach(r => allCategories.add(r.category));
        }

        const monthLabels = Object.keys(dataByMonth);
        const categoryList = Array.from(allCategories);

        const series = categoryList.map(category => {
          const data = monthLabels.map(monthKey => {
            const monthData = dataByMonth[monthKey];
            const categoryData = monthData.find(d => d.category === category);
            return categoryData ? categoryData.total : 0;
          });
          return { name: category, type: 'line', data, smooth: true };
        });

        return { months: monthLabels, categories: categoryList, series };
      };
    },
    getSavingsHistory(state): (months: number) => { labels: string[], data: number[] } {
      return (months) => {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const labels: string[] = [];
        const data: number[] = [];
        
        const totalNow = state.savingsJars.reduce((sum, jar) => sum + jar.currentAmount, 0);
        const transactionsByDate = [...state.savingsJarTransactions].sort((a,b) => a.date.localeCompare(b.date));

        for (let i = months - 1; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i + 1, 0); // End of month `i` months ago
          
          const year = d.getFullYear();
          const month = d.getMonth() + 1; // 1-12
          const day = d.getDate();
          
          const endOfMonthStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          labels.push(`${monthNames[d.getMonth()]} '${year.toString().slice(-2)}`);

          const transactionsAfterThisMonth = transactionsByDate.filter(t => t.date > endOfMonthStr);
          const adjustment = transactionsAfterThisMonth.reduce((sum, t) => sum + t.amount, 0);
          
          const historicalTotal = totalNow - adjustment;
          data.push(parseFloat(historicalTotal.toFixed(2)));
        }

        return { labels, data };
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
      this.savingsJarTransactions = db.getAllSavingsJarTransactions()
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
    performJarTransaction(jarId: string, amount: number) {
      const jar = this.savingsJars.find(j => j.id === jarId);
      if (!jar) return;

      const transactionData = {
        jarId,
        amount,
        date: new Date().toISOString().split('T')[0],
      };
      db.addSavingsJarTransaction(transactionData as any);

      const newCurrentAmount = jar.currentAmount + amount;
      db.updateSavingsJar(jarId, { currentAmount: newCurrentAmount });

      this.fetchAll();
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
