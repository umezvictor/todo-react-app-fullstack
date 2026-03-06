import { defineConfig, coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, //allows us to use global variables like describe, it, expect without importing them
    environment: "jsdom", //simulates a browser environment for testing components that interact with the DOM
    setupFiles: "./src/setupTests.ts", //path to the setup file
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"], //formats for coverage reports
      exclude: [...coverageConfigDefaults.exclude, "src/main.tsx"],
    },
  },
});
//next update tsconfig to include vitest
//run npx vitest --coverage to see coverage report
//run npx vitest --watch to run tests in watch mode
//run npx vitest to run tests once
//run npx vite build to build the project
//run npx vite preview to preview the built project
