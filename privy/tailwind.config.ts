import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-gray-100": "var(--primary-gray-100)",
        "primary-gray-200": "var(--primary-gray-200)",
        "primary-gray-300": "rgb(var(--primary-gray-300) / <alpha-value>)",
        "selected-white": "rgba(255, 255, 255, 0.1)",
        "brand-orange": "var(--brand-orange)",
        "brand-orange-lighten-20": "var(--brand-orange-lighten-20)",
        "brand-orange-foreground": "var(--brand-orange-foreground)",
        "text-black": "var(--text-black)",
        "text-white": "var(--text-white)",
        gray: "var(--gray)",
        "surface-level-1": "var(--surface-level-1)",
        "surface-level-2": "var(--surface-level-2)",
        "surface-level-3": "var(--surface-level-3)",
        "surface-level-4": "var(--surface-level-4)",
        "surface-level-4-lighten-20": "var(--surface-level-4-lighten-20)",
        "surface-border": "rgb(var(--surface-border) / <alpha-value>)",
        "notification-error": "rgb(var(--notification-error) / <alpha-value>)",
        "notification-success":
          "rgb(var(--notification-success) / <alpha-value>)",
        "swap-settings": "rgba(var(--swap-settings) / <alpha-value>)",
        modal: "var(--modal)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--surface-level-2)",
          foreground: "var(--card-foreground)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
