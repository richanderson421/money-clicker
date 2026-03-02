import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        mint: '#7ef9a9',
        emeraldDark: '#042f1e',
        cash: '#1f9d55'
      },
      boxShadow: {
        glow: '0 0 30px rgba(126,249,169,0.35)'
      },
      keyframes: {
        bob: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        sparkle: { '0%': { opacity: '0', transform: 'scale(0.6)' }, '40%': { opacity: '1' }, '100%': { opacity: '0', transform: 'scale(1.2)' } }
      },
      animation: {
        bob: 'bob 2.3s ease-in-out infinite',
        sparkle: 'sparkle 1.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
