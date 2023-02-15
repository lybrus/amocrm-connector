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
}
