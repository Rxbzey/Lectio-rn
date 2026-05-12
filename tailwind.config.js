/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#c9a84c",
        gold: "#c9a84c",
        "gold-dim": "rgba(201, 168, 76, 0.25)",
        "gold-glow": "rgba(201, 168, 76, 0.08)",
        parchment: "#efe6d4",
        ink: "#3d3629",
        void: "#000000",
        "void-light": "#080808",
        "void-mid": "#111111",
        cream: "#b8b3a8",
        "cream-bright": "#c9c4b8",
        "background-light": "#efe6d4",
        "background-dark": "#000000",
      },
      fontFamily: {
        display: ["PlayfairDisplay"],
        serif: ["PlayfairDisplay", "Georgia", "serif"],
        sans: ["Inter"],
      },
    },
  },
  plugins: [],
}
