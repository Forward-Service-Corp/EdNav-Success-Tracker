/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/html/utils/withMT';

export default withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
  safelist: Array.from({ length: 17 }, (_, i) => `h-${i + 33}`)
});
