/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f3b6a',
          light: '#1d5b9e',
          lighter: '#e8f0f8',
          dark: '#092645',
        },
        accent: {
          DEFAULT: '#16a34a',
          hover: '#15803d',
          light: '#22c55e',
        },
        'bg-alt': '#f5f7fa',
        'text-muted': '#5a6872',
        border: '#e2e5e8',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
