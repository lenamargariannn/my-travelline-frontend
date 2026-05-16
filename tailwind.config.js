/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF7FB',
          100: '#D4ECF5',
          200: '#A8D9EB',
          300: '#7CC6E0',
          400: '#50B2D5',
          500: '#3A9FCA',
          600: '#2E7D9C',
          700: '#246685',
          800: '#1A4F6E',
          900: '#103857',
          950: '#082440',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#FEF2F0',
          100: '#FDE2DE',
          200: '#FBC5BB',
          300: '#F8A899',
          400: '#F48B77',
          500: '#E84030',
          600: '#CB2912',
          700: '#A8200D',
          800: '#851808',
          900: '#621005',
          950: '#3F0902',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #103857 0%, #2E7D9C 100%)',
      },
    },
  },
  plugins: [],
};
