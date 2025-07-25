/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'space-black': '#0a0a0a',
        'space-blue': '#1e40af',
      }
    },
  },
  plugins: [],
} 