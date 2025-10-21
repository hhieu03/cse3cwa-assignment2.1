// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "http://localhost:3000", // chạy npm run dev hoặc container map 3000
    // headless: false, // bật để nhìn trình duyệt khi quay video
  },
});
