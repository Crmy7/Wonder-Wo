// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  css: ["~/assets/css/main.css", "~/assets/scss/main.scss"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
