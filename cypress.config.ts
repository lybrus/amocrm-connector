import { defineConfig } from 'cypress'
import plugins from './cypress/plugins'

export default defineConfig({
  userAgent: 'Cypress/Bot',
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return plugins(on, config)
    },
    userAgent: 'MyCustomAgent/1.0'
  },
})
