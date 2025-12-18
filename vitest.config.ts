import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    // محیط تست - happy-dom سریع‌تر از jsdom هست
    environment: "nuxt",

    // پوشه‌هایی که تست‌ها توشون هستن
    include: ["tests/**/*.{test,spec}.ts"],

    // تنظیمات گزارش
    reporters: ["verbose"],

    // فعال کردن globals (مثل describe, it, expect)
    globals: true,
  },
});
