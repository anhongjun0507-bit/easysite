import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        // 일관된 깊이 위계
        xs: '0 1px 2px rgba(17,24,39,.04), 0 1px 1px rgba(17,24,39,.02)',
        brand: '0 12px 32px rgba(79,70,229,.18)',
      },
      transitionTimingFunction: {
        emphasized: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        // 스크롤 유도 화살표 — 부드러운 상하 바운스
        softbounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        softbounce: 'softbounce 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
