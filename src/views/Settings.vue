<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-base-content">Ajustes</h1>

    <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
      <h2 class="text-lg font-semibold text-base-content mb-4">Perfil de Usuario</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1 flex flex-col items-center">
          <img :src="form.avatarUrl" alt="Avatar preview" class="w-32 h-32 rounded-full object-cover bg-base-300 mb-4">
          <div class="grid grid-cols-3 gap-2">
            <img 
              v-for="avatar in predefinedAvatars" 
              :key="avatar" 
              :src="avatar" 
              @click="form.avatarUrl = avatar"
              class="w-10 h-10 rounded-full object-cover cursor-pointer transition-transform hover:scale-110"
              :class="{ 'ring-2 ring-primary ring-offset-2 ring-offset-base-100': form.avatarUrl === avatar }"
            >
          </div>
           <label
            class="mt-4 w-full text-center inline-flex justify-center items-center rounded-lg border border-base-300 shadow-sm px-3 py-2 bg-base-100 text-sm font-medium text-base-content hover:bg-base-200 cursor-pointer"
          >
            <Upload class="mr-2 h-4 w-4" />
            Subir Imagen
            <input type="file" @change="handleImageUpload" class="hidden" accept="image/*" />
          </label>
        </div>
        <div class="md:col-span-2">
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label for="userName" class="block text-sm font-medium text-base-content/70 mb-1">Nombre</label>
              <input type="text" id="userName" v-model="form.name" class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div>
              <label for="userAvatarUrl" class="block text-sm font-medium text-base-content/70 mb-1">URL de la Imagen (opcional)</label>
              <input type="url" id="userAvatarUrl" v-model="form.avatarUrl" class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary">
            </div>
            <div class="flex justify-end pt-4">
              <button type="submit" class="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus">
                Guardar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <CategoryManager />

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
import { ref } from 'vue'
import { Download, Upload } from 'lucide-vue-next'
import ThemeSelector from '@/components/ThemeSelector.vue'
import CategoryManager from '@/components/settings/CategoryManager.vue'
import { useUser } from '@/composables/useUser'
import { db } from '@/services/sqlite'
import { useDatabaseStore } from '@/stores/database'

const store = useDatabaseStore()
const { user, updateUser } = useUser()

const form = ref({
  name: user.value.name,
  avatarUrl: user.value.avatarUrl
})

const predefinedAvatars = [
  'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/60A5FA/FFFFFF/png?text=A',
  'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/F87171/FFFFFF/png?text=B',
  'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/4ADE80/FFFFFF/png?text=C',
  'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/FBBF24/FFFFFF/png?text=D',
  'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/A78BFA/FFFFFF/png?text=E',
  'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/2DD4BF/FFFFFF/png?text=F',
]

const saveUser = () => {
  updateUser(form.value)
  alert('Perfil actualizado con éxito.')
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      form.value.avatarUrl = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);
}

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
    (event.target as HTMLInputElement).value = '';
    return;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    await db.importDatabase(uint8Array);
    await store.fetchAll();
    alert('Copia de seguridad restaurada con éxito. La página se recargará.');
    window.location.reload();
  } catch (e) {
    console.error(e);
    alert('Error al restaurar la copia de seguridad.');
  }
};
</script>
