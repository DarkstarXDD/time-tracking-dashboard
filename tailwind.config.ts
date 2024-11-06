import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*"],
  theme: {
    screens: {
      md: "58rem",
    },

    fontFamily: {
      body: ["Rubik", "sans-serif"],
    },

    fontSize: {
      "preset-1": [
        "0.9375rem",
        { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "400" },
      ],

      "preset-2": [
        "1.125rem",
        { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "400" },
      ],

      "preset-3": [
        "1.125rem",
        { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "500" },
      ],

      "preset-4": [
        "1.5rem",
        { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "300" },
      ],

      "preset-5": [
        "2rem",
        { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "300" },
      ],

      "preset-6": [
        "2.5rem",
        { lineHeight: "1.2", letterSpacing: "0px", fontWeight: "300" },
      ],

      "preset-7": [
        "3.5rem",
        { lineHeight: "1", letterSpacing: "0px", fontWeight: "300" },
      ],
    },

    colors: {
      transparent: "transparent",
      white: "hsl(0, 0%, 100%)",
      grey: "hsl(0, 0%, 85%)",
      purple: {
        DEFAULT: "hsl(246, 80%, 60%)",
        light: "hsl(236, 100%, 87%)",
        dark: "hsl(235, 46%, 20%)",
      },
      orange: "hsl(15, 100%, 70%)",
      aqua: "hsl(195, 74%, 62%)",
      red: "hsl(348, 100%, 68%)",
      green: "hsl(145, 58%, 55%)",
      violet: "hsl(264, 64%, 52%)",
      yellow: "hsl(43, 83%, 65%)",
      "dark-blue": "hsl(226, 43%, 10%)",
    },

    extend: {
      gridTemplateColumns: {
        "3fr-2fr": "3fr 2fr",
        list: "auto 1fr",
      },
    },
  },
  plugins: [],

  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config
