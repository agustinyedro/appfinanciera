import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Management from '../views/Management.vue';
import Transactions from '../views/Transactions.vue';
import Settings from '../views/Settings.vue';
import Reportes from '../views/Reportes.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/gestion', name: 'Gestión', component: Management },
  { path: '/transacciones', name: 'Transacciones', component: Transactions },
  { path: '/reportes', name: 'Reportes', component: Reportes },
  { path: '/ajustes', name: 'Ajustes', component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
