import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#83F",
          secondary: "#f000b8",
          accent: "#1dcdbc",
          neutral: "#2b3440",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
          selected: "#AC9AFF",
        },
      },
    ],
  },
  theme: {
    screens: {
      sm: '500px'
    },
    extend: {
      colors: {
        purple: {
          DEFAULT: "#8833FF",
        },
        "purple-1": "#4318FF",
        "purple-2": "#502FF5",
        "purple-3": "#8740E2",
        "gray-1": "#4D5E80",
        "gray-2": "#F4F7FE"
      },
    },
  },
};
export default config;
