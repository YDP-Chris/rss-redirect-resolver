/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#CCE5FF',
          100: '#B3D9FF',
          200: '#80C7FF',
          300: '#4DB5FF',
          400: '#1AA3FF',
          500: '#0066FF', // Main brand color
          600: '#0052CC', // Darker variant
          700: '#0041A3',
          800: '#003080',
          900: '#001F5C',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Secondary text
          600: '#475569',
          700: '#334155', // Primary text
          800: '#1E293B',
          900: '#0F172A',
        },
        success: {
          500: '#10B981', // Success green
          600: '#059669',
        },
        warning: {
          500: '#F59E0B', // Warning orange
          600: '#D97706',
        },
        error: {
          500: '#EF4444', // Error red
          600: '#DC2626',
        }
      },
    },
  },
  plugins: [],
}