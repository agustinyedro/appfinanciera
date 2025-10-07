import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import type { Account, SavingsJar, SavingsJarTransaction, Tag, Transaction } from '@/types';

class SQLiteService {
  private db: any = null;

  async init() {
    if (this.db) return;
    try {
      const sqlite3 = await sqlite3InitModule({
        print: console.log,
        printErr: console.error,
      });
      
      if ('opfs' in sqlite3) {
        this.db = new sqlite3.oo1.OpfsDb('/finance.db', 'c');
        console.log('OPFS is available, created persisted database at /finance.db');
      } else {
        this.db = new sqlite3.oo1.DB('/finance.db', 'c');
        console.log('OPFS is not available, created an in-memory database.');
      }
      
      this.createTables();
    } catch (err: any) {
      console.error('Error initializing SQLite:', err.message);
    }
  }

  private createTables() {
    this.db.exec('PRAGMA foreign_keys = ON;');
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL NOT NULL,
        currency TEXT NOT NULL,
        isActive INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS savings_jars (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        targetAmount REAL NOT NULL,
        currentAmount REAL NOT NULL,
        description TEXT,
        deadline TEXT,
        isActive INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        icon TEXT,
        color TEXT
      );
      CREATE TABLE IF NOT EXISTS savings_jar_transactions (
        id TEXT PRIMARY KEY,
        jarId TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (jarId) REFERENCES savings_jars(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        icon TEXT,
        category TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        accountId TEXT NOT NULL,
        tagId TEXT NOT NULL,
        date TEXT NOT NULL,
        isRecurring INTEGER NOT NULL,
        recurringConfig TEXT,
        creditCardConfig TEXT,
        createdAt TEXT NOT NULL
      );
    `);
    
    // Add default tags if table is empty
    const tagCount = this.db.selectValue('SELECT COUNT(*) FROM tags');
    if (tagCount === 0) {
      const defaultTags: Omit<Tag, 'id' | 'createdAt'>[] = [
        { name: 'Alimentación', color: '#ef4444', icon: 'Utensils', category: 'gasto' },
        { name: 'Transporte', color: '#3b82f6', icon: 'Car', category: 'gasto' },
        { name: 'Vivienda', color: '#f97316', icon: 'Home', category: 'gasto' },
        { name: 'Salud', color: '#14b8a6', icon: 'Stethoscope', category: 'gasto' },
        { name: 'Salario', color: '#10b981', icon: 'Briefcase', category: 'ingreso' },
        { name: 'Freelance', color: '#84cc16', icon: 'Laptop', category: 'ingreso' }
      ];
      defaultTags.forEach(tag => this.addTag(tag));
    }
  }

  private parseRow(row: any): any {
    if (!row) return row;
    const parsed = { ...row };
    if (parsed.isActive !== undefined) parsed.isActive = !!parsed.isActive;
    if (parsed.isRecurring !== undefined) parsed.isRecurring = !!parsed.isRecurring;
    if (parsed.recurringConfig) parsed.recurringConfig = JSON.parse(parsed.recurringConfig);
    if (parsed.creditCardConfig) parsed.creditCardConfig = JSON.parse(parsed.creditCardConfig);
    return parsed;
  }
  
  // Generic CRUD
  private getAll<T>(table: string): T[] {
    const rows = this.db.selectObjects(`SELECT * FROM ${table}`);
    return rows.map(this.parseRow);
  }

  private add(table: string, data: any) {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    
    const columns = ['id', 'createdAt'];
    const values: any[] = [id, createdAt];
    const placeholders = ['?', '?'];

    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] !== undefined) {
        columns.push(key);
        let value = data[key];
        if (typeof value === 'boolean') {
          value = value ? 1 : 0;
        } else if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        values.push(value);
        placeholders.push('?');
      }
    }

    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
    this.db.exec(sql, { bind: values });
  }

  private update(table: string, id: string, updates: any) {
    const setClauses: string[] = [];
    const values: any[] = [];
    for (const key in updates) {
       if (updates.hasOwnProperty(key) && updates[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        let value = updates[key];
        if (typeof value === 'boolean') {
          value = value ? 1 : 0;
        } else if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value);
        }
        values.push(value);
      }
    }
    if (setClauses.length === 0) return;
    
    values.push(id);
    const sql = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE id = ?`;
    this.db.exec(sql, { bind: values });
  }

  private delete(table: string, id: string) {
    this.db.exec(`DELETE FROM ${table} WHERE id = ?`, [id]);
  }
  
  // Specific methods
  getAllAccounts = (): Account[] => this.getAll('accounts');
  addAccount = (data: Omit<Account, 'id'|'createdAt'>) => this.add('accounts', data);
  updateAccount = (id: string, updates: Partial<Account>) => this.update('accounts', id, updates);
  deleteAccount = (id: string) => this.delete('accounts', id);

  getAllSavingsJars = (): SavingsJar[] => this.getAll('savings_jars');
  addSavingsJar = (data: Omit<SavingsJar, 'id'|'createdAt'>) => this.add('savings_jars', data);
  updateSavingsJar = (id: string, updates: Partial<SavingsJar>) => this.update('savings_jars', id, updates);
  deleteSavingsJar = (id: string) => this.delete('savings_jars', id);

  getAllSavingsJarTransactions = (): SavingsJarTransaction[] => this.getAll('savings_jar_transactions');
  addSavingsJarTransaction = (data: Omit<SavingsJarTransaction, 'id' | 'createdAt'>) => this.add('savings_jar_transactions', data);

  getAllTags = (): Tag[] => this.getAll('tags');
  addTag = (data: Omit<Tag, 'id'|'createdAt'>) => this.add('tags', data);
  updateTag = (id: string, updates: Partial<Tag>) => this.update('tags', id, updates);
  deleteTag = (id: string) => this.delete('tags', id);

  getAllTransactions = (): Transaction[] => this.getAll('transactions');
  addTransaction(data: Omit<Transaction, 'id'|'createdAt'>) {
    this.add('transactions', data);
    const account = this.getOne<Account>('accounts', data.accountId);
    if(account) {
      const newBalance = account.balance + (data.type === 'ingreso' ? data.amount : -data.amount);
      this.update('accounts', data.accountId, { balance: newBalance });
    }
  }
  updateTransaction(id: string, updates: Partial<Transaction>) {
    const oldTx = this.getOne<Transaction>('transactions', id);
    if (!oldTx) return;

    // Revert old transaction
    const oldAccount = this.getOne<Account>('accounts', oldTx.accountId);
    if (oldAccount) {
      const revertedBalance = oldAccount.balance - (oldTx.type === 'ingreso' ? oldTx.amount : -oldTx.amount);
      this.update('accounts', oldTx.accountId, { balance: revertedBalance });
    }

    const newTx = { ...oldTx, ...updates };
    this.update('transactions', id, updates);

    // Apply new transaction
    const newAccount = this.getOne<Account>('accounts', newTx.accountId);
    if (newAccount) {
      const newBalance = newAccount.balance + (newTx.type === 'ingreso' ? newTx.amount : -newTx.amount);
      this.update('accounts', newTx.accountId, { balance: newBalance });
    }
  }
  deleteTransaction(id: string) {
    const tx = this.getOne<Transaction>('transactions', id);
    if (tx) {
        const account = this.getOne<Account>('accounts', tx.accountId);
        if (account) {
            const newBalance = account.balance - (tx.type === 'ingreso' ? tx.amount : -tx.amount);
            this.update('accounts', tx.accountId, { balance: newBalance });
        }
    }
    this.delete('transactions', id);
  }

  private getOne<T>(table: string, id: string): T | null {
    const row = this.db.selectObject(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return row ? this.parseRow(row) : null;
  }

  exportDatabase = (): Uint8Array => {
    return this.db.export();
  }

  importDatabase = async (data: Uint8Array) => {
    this.db.close();
    const sqlite3 = await sqlite3InitModule();
    if ('opfs' in sqlite3) {
      this.db = new sqlite3.oo1.OpfsDb('/finance.db', 'c');
    } else {
      this.db = new sqlite3.oo1.DB('/finance.db', 'c');
    }
    this.db.import(data);
  }
}

export const db = new SQLiteService();
