/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: withOpacity('--color-primary'),
          'primary-focus': withOpacity('--color-primary-focus'),
          'primary-content': withOpacity('--color-primary-content'),
          
          secondary: withOpacity('--color-secondary'),
          'secondary-focus': withOpacity('--color-secondary-focus'),
          'secondary-content': withOpacity('--color-secondary-content'),

          accent: withOpacity('--color-accent'),
          'accent-focus': withOpacity('--color-accent-focus'),
          'accent-content': withOpacity('--color-accent-content'),

          neutral: withOpacity('--color-neutral'),
          'neutral-focus': withOpacity('--color-neutral-focus'),
          'neutral-content': withOpacity('--color-neutral-content'),
          
          'base-100': withOpacity('--color-base-100'),
          'base-200': withOpacity('--color-base-200'),
          'base-300': withOpacity('--color-base-300'),
          'base-content': withOpacity('--color-base-content'),

          info: withOpacity('--color-info'),
          success: withOpacity('--color-success'),
          warning: withOpacity('--color-warning'),
          error: withOpacity('--color-error'),
        }
      },
    },
    plugins: [],
  }
