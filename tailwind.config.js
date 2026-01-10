/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#111111", // Black (Main Action)
        accent: "#111111", // Replaced Blue with Black for monochrome premium feel (or a very subtle grey if needed)
        background: "#FFFFFF",
        surface: "#F9F9F9", // Slightly off-white for contrast
        "surface-dark": "#111111",
        text: "#000000",
        "text-muted": "#757575", // Darker grey for better readability but still muted
        "text-inverted": "#FFFFFF",
        border: "#E5E5E5", // Very light border
        error: "#D32F2F",
        success: "#388E3C",
      },
      fontFamily: {
        sans: ["Inter", "System"],
      }
    },
  },
  plugins: [],
}
