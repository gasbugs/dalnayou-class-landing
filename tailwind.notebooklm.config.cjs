module.exports = {
  content: ["./notebooklm.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        cream: { 50: "#FFFCF7", 100: "#FFF8E7" },
        ink: { 700: "#3F2D20", 800: "#2A1D14", 900: "#1F1410" },
      },
      fontFamily: {
        sans: ["Pretendard", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 28px -14px rgba(20, 40, 90, .22)",
      },
    },
  },
};
