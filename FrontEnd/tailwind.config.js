/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./component/**/*.{js,jsx,ts,tsx}" ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        "primary": {
          100: '#A4C2A5',
          200: '#789482',
          300: '#536663',
        },
        accent: {
          100: '#F1F2EB',
        },
        black:{
          DEFAULT: '#000000',
          100: '#D1D5C8',
          200: '#9FA38F',
          300: '#2B2D25',
        }
      }
    },
  },
  plugins: [],
}