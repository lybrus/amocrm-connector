import { IntegrationCredential } from './integration-credential'

export class Integration {
    integrationId: string
    secretKey: string
    redirectUri: string

    constructor(credential: IntegrationCredential) {
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
}
