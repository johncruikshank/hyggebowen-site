/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#080c08',
        bark: '#1a1714',
        rust: '#c4572a',
        'rust-glow': '#d4683d',
        cream: '#f0ebe3',
      },
      transitionDuration: {
        400: '400ms',
        900: '900ms',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
