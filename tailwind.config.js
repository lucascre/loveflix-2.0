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
        'papiro-light': '#F5EFE6',
        'papiro-dark': '#E8DFCA',
        'ink-dark': '#3D2B1F',
        // 👇 ESTA É A COR CORRIGIDA - MUITO MAIS ESCURA E LEGÍVEL
        'ink-light': '#5C524D',
        'gold-accent': '#B8860B',
        'rose-accent': '#C48787',
      },
      fontFamily: {
        sans: ['var(--font-quicksand)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}