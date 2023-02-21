import { IntegrationCredential } from './integration-credential'
import EventEmitter from 'events'
import { Client } from './client'

export interface IntegrationEventMap {
    'setup': [Client, string]
}

export class Integration extends EventEmitter {
    integrationId: string
    secretKey: string
    redirectUri: string

    constructor(credential: IntegrationCredential) {
        super()

        const {
            integrationId,
            secretKey,
            redirectUri
        } = credential

        this.integrationId = integrationId
        this.secretKey = secretKey
        this.redirectUri = redirectUri
    }

    getOAuthLink(state = '', mode: 'post_message' | 'popup' = 'post_message') {
        const { integrationId } = this
        return `https://www.amocrm.ru/oauth?client_id=${integrationId}&state=${state}&mode=${mode}`
    }

    async processOAuthRedirect(query: { [key: string]: string }) {
        const referer = query['referer']
        const code = query['code']
        const integrationId = query['client_id']
        const state = query['state']
        if (!code || !referer || !integrationId || !state) return
        if (integrationId !== this.integrationId) return

        const match = referer.match(/([^.]*)\.(.*)/)
        if (!match) return

        const [subdomain, mainDomain] = match.slice(1)
        if (!subdomain || !mainDomain) return

        const client = new Client({
            integration: this,
            subdomain,
            mainDomain
        })

        await client.getToken({ code })

        this.emit('setup', client, state)
    }

    override on<Event extends keyof IntegrationEventMap>(event: Event, listener: (...value: IntegrationEventMap[Event]) => void): this
    override on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener)
    }

    override addListener<Event extends keyof IntegrationEventMap>(event: Event, listener: (...value: IntegrationEventMap[Event]) => void): this
    override addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener)
    }

    override removeListener<Event extends keyof IntegrationEventMap>(event: Event, listener: (...value: IntegrationEventMap[Event]) => void): this
    override removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener)
    }
}
