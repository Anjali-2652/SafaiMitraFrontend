/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        poppins: ["Poppins", "sans-serif"],
        sourgummy: ["Sour Gummy", "cursive"],
        borel: ["Borel", "sans-serif"],
      }
    },
    colors:{
      primary: "#2e8b57",
      primaryDark: "#256f46",
      primaryColor : "#01a67a",
      textWhite: "#ffffff",
      textBlack: "#000000",
      shadowColor: "#386641",
      babyPink: "#f4c2c2",
      darkOrange: "#ff8c00",
      kellyGreen: "#4CBB17",
      GoldenMustard: "#a67a01",
      Ivory: "#f5f5f5",
      CharcoalGray: "#36454f",
      Sand: "#c2b280",
      lightBlue: "#add8e6",
      lightGreen: "#90ee90",
      lightYellow: "#ffffe0",
      lightCoral: "#f08080",
      GreenKelly: "#2da601",
      RichPurple: "#6a0dad",
      BrightRed: "#ff0000",
      DeepBlue: "#00008b",
      GoldenYellow: "#ffd700",
      SoftPink: "#ffb6c1",
      CoolGray: "#8c92ac",
      WarmBrown: "#a52a2a",
      secondary: "#f4f7f5",
      dark: "#1f2937"
    }
  },
  plugins: [],
}