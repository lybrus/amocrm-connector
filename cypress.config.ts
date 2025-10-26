import { defineConfig } from 'cypress'
import plugins from './cypress/plugins'

export default defineConfig({
  userAgent: 'Cypress/Bot',
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--user-agent=MyCustomAgent/1.0')
        }
        return launchOptions
      })
      return plugins(on, config)
    },
  },
})
