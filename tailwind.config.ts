import type { Config } from "tailwindcss";
import theme from "./src/styles/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        background: theme.colors.background,
        cardBackground: theme.colors.cardBackground,
        textPrimary: theme.colors.textPrimary,
        textSecondary: theme.colors.textSecondary,
        error: theme.colors.error,
        success: theme.colors.success,
      },
      fontFamily: {
        sans: [theme.typography.fontFamily],
      },
      spacing: {
        ...Array.from({ length: 10 }, (_, i) => i + 1).reduce((acc, val) => {
          acc[val] = theme.spacing(val);
          return acc;
        }, {} as Record<string, string>),
      },
    },
  },
  plugins: [],
};
export default config;
