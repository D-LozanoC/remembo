import type { Config } from "tailwindcss";

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
        yellow_500: "#FFEB3B",
        yellow_300: "#FFC107",
        yellow_200: "#DDA400",
        yellow_100: "#916400",
        blue_500: "#00BCD4",
        blue_400: "005E74",
        blue_200: "1A1E3B",
        blue_100: "#0B0F2B",
        text_500: "#FFFFFF",
        text_200: "#9C9C9C",
        orange_400: "#FF5722",
        orange_200: "#FFCC80",
        pink_100: "#FF5252",
        pink_200: "#E78585",
        pink_300: "#FFAB91",
        pink_500: "#FFCCBC",
      },
    },
  },
  plugins: [],
} satisfies Config;
