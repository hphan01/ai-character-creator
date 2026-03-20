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
        primary: '#b91c1c',
        secondary: '#991b1b',
      },
      backgroundImage: {
        gradient: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
      },
    },
  },
  plugins: [],
}
export default config
