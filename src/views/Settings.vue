<template>
  <div class="space-y-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold text-base-content">Ajustes</h1>

    <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
      <h2 class="text-lg font-semibold text-base-content mb-4">Tema Visual</h2>
      <ThemeSelector />
    </div>

    <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
      <h2 class="text-lg font-semibold text-base-content mb-4">Copia de Seguridad</h2>
      <p class="text-sm text-base-content/70 mb-4">
        Crea una copia de seguridad de todos tus datos en un solo archivo. Puedes usar este archivo para restaurar tus datos en este o en otro dispositivo.
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
        <button 
          @click="handleExport"
          class="w-full sm:w-auto flex-1 inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus"
        >
          <Download class="mr-2 h-5 w-5" />
          Crear Copia
        </button>
        <label
          class="w-full sm:w-auto flex-1 inline-flex justify-center items-center rounded-lg border border-base-300 shadow-sm px-4 py-2 bg-base-100 text-base font-medium text-base-content hover:bg-base-200 cursor-pointer"
        >
          <Upload class="mr-2 h-5 w-5" />
          Restaurar Copia
          <input type="file" @change="handleImport" class="hidden" accept=".db" />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download, Upload } from 'lucide-vue-next'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { db } from '@/services/sqlite'
import { useDatabaseStore } from '@/stores/database'

const store = useDatabaseStore()

const handleExport = () => {
  try {
    const data = db.exportDatabase();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finanzas-backup-${new Date().toISOString().split('T')[0]}.db`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Copia de seguridad creada con éxito.');
  } catch (e) {
    console.error(e);
    alert('Error al crear la copia de seguridad.');
  }
};

const handleImport = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  if (!confirm('¿Estás seguro? Esto reemplazará todos tus datos actuales.')) {
    // Clear the file input
    (event.target as HTMLInputElement).value = '';
    return;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    await db.importDatabase(uint8Array);
    await store.fetchAll(); // Recargar datos en el estado de Pinia
    alert('Copia de seguridad restaurada con éxito. La página se recargará.');
    window.location.reload();
  } catch (e) {
    console.error(e);
    alert('Error al restaurar la copia de seguridad.');
  }
};
</script>
