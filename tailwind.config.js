/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F16",
          panel: "#121826",
          line: "#232C3D"
        },
        brand: {
          red: "#E23744",
          redDeep: "#B92430",
          blue: "#2F80ED",
          blueDeep: "#1F5FC4"
        },
        fog: {
          50: "#F5F7FA",
          100: "#EDF0F5",
          200: "#DCE2EA"
        }
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"]
      },
      borderRadius: {
        card: "14px"
      }
    }
  },
  plugins: []
};
