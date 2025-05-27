/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        doctor: {
          red: "#ff4c4c",
          orange: "#ff9f1c",
          deeporange: "#ff5714",
          green: "#6cc551",
          beige: "#fdf6e3",
          blue: "#1f7a8c",
        },
      },
    },
  },
  plugins: [],
};
