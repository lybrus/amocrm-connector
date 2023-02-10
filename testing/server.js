import AmoCRM from '..'
import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { saveToken } from './tokenStore'

export const amocrm = new AmoCRM({
    credential: {
        domain: process.env.DOMAIN,
        integrationId: process.env.INTEGRATION_ID,
        secretKey: process.env.SECRET_KEY,
        redirectUri: process.env.REDIRECT_URI || `https://${process.env.TUNNEL_SUBDOMAIN}.loca.lt`
    }
})
amocrm.on('token', saveToken)

const app = new Koa()
const router = new Router()

router.use(koaBody())
app.use(router.routes())

router.get('/amo', async ctx => {
    const { code } = ctx.query

    if (!code) return

    await amocrm.getToken({ code })

    ctx.status = 200
    ctx.body = 'Access granted!'
})

const port = process.env.SERVER_PORT || 3000
const server = app.listen(port, () => {
    console.log(`listening port ${port}`)
})

process.on('SIGTERM', () => {
    server.close(async () => {
        await amocrm.uninit()

        process.exit(0)
    })
})

export default server
