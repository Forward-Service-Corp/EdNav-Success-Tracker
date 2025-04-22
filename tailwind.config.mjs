/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/html/utils/withMT";

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
      keyframes: {
        fadeInZoom: {
          "0%": { opacity: 0, transform: "scale(0.8)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        pulseOnce: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "50%": { transform: "scale(1.02)", opacity: 0.85 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        fadeInZoom: "fadeInZoom 0.4s ease-out",
        pulseOnce: "pulseOnce 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
  safelist: Array.from({ length: 17 }, (_, i) => `h-${i + 33}`),
});
