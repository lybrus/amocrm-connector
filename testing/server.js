import { Client, Integration } from '..'
import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { saveToken } from './tokenStore'

export const integration = new Integration({
    integrationId: process.env.INTEGRATION_ID,
    secretKey: process.env.SECRET_KEY,
    redirectUri: process.env.REDIRECT_URI || `https://${ process.env.TUNNEL_SUBDOMAIN }.loca.lt`
})

export const client = new Client({
    integration,
    domain: process.env.DOMAIN
})

client.on('token', saveToken)

const app = new Koa()
const router = new Router()

router.use(koaBody())
app.use(router.routes())

router.get('/', async ctx => {
    const { code } = ctx.query

    if (!code) return

    try {
        await client.getToken({ code })
    } catch (e) {
        console.log(e)
    }

    ctx.status = 200
    ctx.body = 'Access granted!'
})

const port = process.env.SERVER_PORT || 3000
const server = app.listen(port, () => {
    console.log(`listening port ${ port }`)
})

process.on('SIGTERM', () => {
    server.close(async () => {
        await amocrm.uninit()

        process.exit(0)
    })
})

export default server
