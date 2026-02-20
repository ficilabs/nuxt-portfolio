// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/google-fonts',
    '@storyblok/nuxt',
  ],

  storyblok: {
    accessToken: process.env.STORYBLOK_TOKEN,
    apiOptions: {
      region: 'eu',
    },
  },
  css: [
    '~/assets/styles/styles.scss',
  ],
  googleFonts: {
    download: true,
    preload: true,
    overwriting: true,
    families: {
      'Open Sans': {
        wght: [300, 700],
      },
      'Jost': {
        wght: [700],
      }
    }
  }
})