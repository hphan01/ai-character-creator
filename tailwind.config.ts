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
        primary: '#5a5a5a',
        secondary: '#4a4a4a',
      },
      backgroundImage: {
        gradient: 'linear-gradient(135deg, #5a5a5a 0%, #3a3a3a 100%)',
      },
    },
  },
  plugins: [],
}
export default config
