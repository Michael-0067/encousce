import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        enc: {
          bg: "#0f0f11",
          surface: "#1a1a20",
          "surface-2": "#222230",
          border: "#2a2a38",
          plum: "#8b4f8b",
          "plum-light": "#b06eb0",
          "plum-dark": "#6b3568",
          rose: "#c4869b",
          "rose-muted": "#9a6478",
          cream: "#f0e6d8",
          "cream-muted": "#c8bcac",
          text: "#e8e0d4",
          muted: "#7a7088",
          dim: "#4a4460",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
