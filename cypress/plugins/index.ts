/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import { Integration } from '../..'

const subdomain = process.env.SUBDOMAIN || ''
const integrationId = process.env.INTEGRATION_ID || ''
const username = process.env.USERNAME || ''
const password = process.env.PASSWORD || ''
const redirectUri = process.env.REDIRECT_URI || ''

const integration = new Integration({
    integrationId,
    secretKey: '',
    redirectUri
})

/**
 * @type {Cypress.PluginConfig}
 */
export default (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    on('task', {
        getParameters() {
            const link = integration.getOAuthLink()

            return {
                link,
                username,
                password,
                subdomain
            }
        }
    })
}
