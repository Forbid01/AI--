/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    '../../packages/templates/*/**/*.{js,jsx}',
    '!../../packages/templates/**/node_modules/**',
  ],
  theme: { extend: {} },
  plugins: [],
};
