import honox, { devServerDefaultOptions } from "honox/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    honox({
      client: {
        input: ["/app/index.css"],
      },
      devServer: {
        exclude: [
          ...devServerDefaultOptions.exclude,
          /^\/app\/.+/,
          /^\/favicon.ico/,
          /^\/static\/.+/,
          /^\/background.jpeg/,
        ],
      },
    }),
  ],
});
