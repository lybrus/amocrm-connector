import './module-alias'
import { Integration } from '../src'
import express from 'express'
import { saveToken } from './token-store'


export const integration = new Integration({
    integrationId: process.env.INTEGRATION_ID || '',
    secretKey: process.env.SECRET_KEY || '',
    redirectUri: process.env.REDIRECT_URI || `https://${process.env.TUNNEL_SUBDOMAIN}.loca.lt`
})

integration.on('setup', (client) => {
    client.on('token', saveToken)
})

const app = express()
app.get('/', async (req, res) => {
    await integration.processOAuthRedirect(req.query as { [key: string]: string })

    return res.end('Access granted!')
})
const port = process.env.SERVER_PORT || 3000
const server = app.listen(port, () => {
    console.log(`listening port ${port}`)
})

process.on('SIGTERM', () => {
    server.close(async () => {
        process.exit(0)
    })
})

export default server
