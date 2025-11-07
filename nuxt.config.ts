import { resolve } from "path";

export default defineNuxtConfig({
  devtools: { enabled: true },

  alias: {
    "@": resolve(__dirname, "./"),
  },

  css: ["@/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ["@nuxtjs/supabase"],
  plugins: [],

  supabase: {
    redirect: false,
  },

  compatibilityDate: "2024-09-02",
});