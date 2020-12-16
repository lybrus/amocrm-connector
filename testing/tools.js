import token from './token.json'
import { AmoCRM } from '~/AmoCRM'

export { default as token } from './token.json'

const domain = process.env.DOMAIN
const integrationId = process.env.INTEGRATION_ID
const secretKey = process.env.SECRET_KEY
const redirectUri = `https://${process.env.TUNNEL_SUBDOMAIN}.loca.lt`

token.accessUntil = new Date(token.accessUntil)
token.refreshUntil = new Date(token.refreshUntil)

export function getAmo() {
    return new AmoCRM({
        credential: {
            domain,
            integrationId,
            secretKey,
            redirectUri
        },
        token
    })
}
