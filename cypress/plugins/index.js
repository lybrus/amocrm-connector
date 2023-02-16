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

const domain = process.env.DOMAIN
const integrationId = process.env.INTEGRATION_ID
const tunnelSubdomain = process.env.TUNNEL_SUBDOMAIN
const username = process.env.USERNAME
const password = process.env.PASSWORD

const { Client, Integration } = require('../../')

const integration = new Integration({
    integrationId,
    redirectUri: `https://${ tunnelSubdomain }.loca.lt`
})

const client = new Client({
    integration,
    domain
})

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    on('task', {
        getParameters() {
            const link = integration.getOAuthLink()

            return {
                link,
                username,
                password,
                domain
            }
        }
    })
}
