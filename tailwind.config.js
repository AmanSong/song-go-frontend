/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        Primary: "#DA7676",
        Secondary: "#3C3636",
        Dark: "#1E1E1E",
        TransparentWhite: "rgba(255, 255, 255, 0.15)",
      },
    },
  },
  plugins: [],
}