import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Accounts from '../views/Accounts.vue';
import SavingsJars from '../views/SavingsJars.vue';
import Transactions from '../views/Transactions.vue';
import Tags from '../views/Tags.vue';
import Settings from '../views/Settings.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/cuentas', name: 'Accounts', component: Accounts },
  { path: '/ahorros', name: 'SavingsJars', component: SavingsJars },
  { path: '/transacciones', name: 'Transactions', component: Transactions },
  { path: '/categorias', name: 'Tags', component: Tags },
  { path: '/ajustes', name: 'Settings', component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
