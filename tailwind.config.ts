import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        'brand': '#FF4500',
        'brand-secondary': '#0079D3',

        // Light mode colors
        'light-bg': '#DAE0E6',
        'light-fg': '#FFFFFF',
        'light-border': '#CCCCCC',
        'light-text-primary': '#1A1A1B',
        'light-text-secondary': '#7C7C7C',

        // Dark mode colors
        'dark-bg': '#030303',
        'dark-fg': '#1A1A1B',
        'dark-border': '#343536',
        'dark-text-primary': '#D7DADC',
        'dark-text-secondary': '#818384',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem',  // 352px
      },
      maxWidth: {
        'content': '64rem', // 1024px - max-w-4xl equivalent
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
}

export default config
