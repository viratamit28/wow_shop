/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        
        'luxury-serif': ['"Playfair Display"', 'serif'],
        'luxury-sans': ['Montserrat', 'sans-serif'],    
      },

      colors: {
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}