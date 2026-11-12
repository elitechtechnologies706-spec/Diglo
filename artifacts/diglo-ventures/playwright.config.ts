import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const localChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/repl/tools/bin/chromium";

export default defineConfig({
  testDir: "./tests",
  outputDir: "../../.cache/playwright/diglo-ventures",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    launchOptions: {
      ...(existsSync(localChromium) ? { executablePath: localChromium } : {}),
      args: ["--no-sandbox"],
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "PORT=4173 BASE_PATH=/ pnpm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
