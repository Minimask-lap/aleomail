import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      fontFamily: {
        Inter: ['Inter', 'system-ui'],
        Nunito: ['Nunito Sans', 'system-ui']
      },
      colors: {
        indigo: {
          950: '#121212'
        },
        brand: '#121212'
      },
      screens: {
        'iphone-se': '320px',
        xiaomi: '360px',
        iphone: '375px',
        'iphone-12': '390px',
        iphonexr: '414px',
        iphone12: '428px',
        'ipad-mini': '768px',
        'ipad-air': '820px',
        fold: '884px'
      }
    }
  },
  plugins: []
};
export default config
