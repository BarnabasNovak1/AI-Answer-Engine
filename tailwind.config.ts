import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'text-pulse': 'textPulse 7s ease-in-out infinite',
        'border-flow': 'borderFlow 4s linear infinite',
      },
      keyframes: {
        textPulse: {
          '0%, 100%': { 
            color: '#ffffff',
            transform: 'scale(1)',
          },
          '50%': { 
            color: '#1A1A1A',
            transform: 'scale(1.05)',
          },
        },
        borderFlow: {
          '0%': { 
            backgroundPosition: '-200% 100%'
          },
          '100%': { 
            backgroundPosition: '200% 100%'
          }
        },
      },
    },
  },
  plugins: [
    typography()
  ],
} satisfies Config;