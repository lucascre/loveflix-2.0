// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0f172a',
        'space-blue': '#1e293b',
        'star-gold': '#facc15',
        'nebula-purple': '#a78bfa',
        'text-light': '#e2e8f0',
        'text-dark': '#94a3b8',
      },
      fontFamily: {
        sans: ['var(--font-quicksand)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [],
}