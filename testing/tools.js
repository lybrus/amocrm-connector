import { AmoCRM, events } from '~/AmoCRM'
import { saveToken, loadToken } from './tokenStore'

const domain = process.env.DOMAIN
const integrationId = process.env.INTEGRATION_ID
const secretKey = process.env.SECRET_KEY
const redirectUri = `https://${process.env.TUNNEL_SUBDOMAIN}.loca.lt`

const debug = process.env.DEBUG

const token = loadToken()

export function getAmo() {
    const amocrm = new AmoCRM({
        credential: {
            domain,
            integrationId,
            secretKey,
            redirectUri
        },
        token,
        options: {
            debug
        }
    })

    amocrm.on(events.token, saveToken)
    return amocrm
}
