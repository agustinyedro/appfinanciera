import { ref, watch } from 'vue';
import { useTheme } from '@/composables/useTheme';

function getHSLColor(cssVariable: string): string {
  if (typeof window === 'undefined') return '';
  const color = getComputedStyle(document.documentElement).getPropertyValue(cssVariable).trim();
  if (!color) {
    if (cssVariable === '--bc') return 'hsl(215 28% 17%)';
    if (cssVariable === '--b1') return 'hsl(0 0% 100%)';
    if (cssVariable === '--p') return 'hsl(221 83% 53%)';
    if (cssVariable === '--s') return 'hsl(217 9% 51%)';
    if (cssVariable === '--a') return 'hsl(158 64% 52%)';
    if (cssVariable === '--su') return 'hsl(158 64% 52%)';
    if (cssVariable === '--er') return 'hsl(0 84% 60%)';
    return 'hsl(0 0% 0%)';
  }
  return `hsl(${color})`;
}

export function useChartTheme() {
  const { currentTheme } = useTheme();

  const textColor = ref(getHSLColor('--bc'));
  const borderColor = ref(getHSLColor('--b1'));
  const primaryColor = ref(getHSLColor('--p'));
  const secondaryColor = ref(getHSLColor('--s'));
  const accentColor = ref(getHSLColor('--a'));
  const successColor = ref(getHSLColor('--su'));
  const errorColor = ref(getHSLColor('--er'));

  watch(currentTheme, () => {
    setTimeout(() => {
      textColor.value = getHSLColor('--bc');
      borderColor.value = getHSLColor('--b1');
      primaryColor.value = getHSLColor('--p');
      secondaryColor.value = getHSLColor('--s');
      accentColor.value = getHSLColor('--a');
      successColor.value = getHSLColor('--su');
      errorColor.value = getHSLColor('--er');
    }, 100);
  }, { immediate: true });

  return {
    textColor,
    borderColor,
    primaryColor,
    secondaryColor,
    accentColor,
    successColor,
    errorColor,
  };
}