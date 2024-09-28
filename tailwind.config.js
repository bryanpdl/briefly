module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5A3E80',
        'primary-dark': '#4A3268',
        'primary-light': '#7A5EA0',
        background: '#E0D8EB',
        text: '#333333',
        'text-light': '#666666',
        danger: '#DC2626',
        success: '#10B981',
        warning: '#F59E0B',
        'input-bg': '#F5F5F5',
        'input-border': '#D1D1D1',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}