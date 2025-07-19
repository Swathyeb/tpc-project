const flowbite = require("flowbite/plugin");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include JS/TS/JSX files
    "./public/index.html",        
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}", // Include Flowbite classes
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite],
};
