import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        "bg-2": "#0e0e0d",
        ink: "#edede4",
        "ink-dim": "#8f8f86",
        acid: "#c6ff3a",
        "acid-deep": "#9ed40f",
      },
      fontFamily: {
        display: ['"Syne"', "system-ui", "sans-serif"],
        body: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
