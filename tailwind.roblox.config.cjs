module.exports = {
  content: ["./roblox.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF5EE",
          100: "#FFE6D5",
          200: "#FFC9A8",
          500: "#FF7A45",
          600: "#EA580C",
          700: "#C2410C",
        },
        cream: { 50: "#FFFCF7", 100: "#FFF8E7" },
        ink: { 700: "#3F2D20", 800: "#2A1D14", 900: "#1F1410" },
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 28px -14px rgba(60, 30, 10, .22)",
      },
    },
  },
};
