export default defineNuxtConfig({
  runtimeConfig: {
    postgres: {
      url: process.env.POSTGRES_URL
    }
  },
  compatibilityDate: "2025-04-07"
})