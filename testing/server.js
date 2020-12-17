import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { AmoCRM } from '../src/AmoCRM'
import fs from 'fs'
import path from 'path'

export const amocrm = new AmoCRM({
    credential: {
        domain: process.env.DOMAIN,
        integrationId: process.env.INTEGRATION_ID,
        secretKey: process.env.SECRET_KEY,
        redirectUri: `https://${process.env.TUNNEL_SUBDOMAIN}.loca.lt`
    },
    options: {
        debug: process.env.DEBUG
    }
})
amocrm.on('token', token => {
    const tokenPath = path.resolve(__dirname, 'token.json')
    fs.writeFileSync(tokenPath, JSON.stringify(token))
    console.log(`Saved token to ${tokenPath}`)
})

const app = new Koa()
const router = new Router()

router.use(koaBody())
app.use(router.routes())

router.get('/', async ctx => {
    const { code } = ctx.query

    if (!code) return

    await amocrm.getToken({ code })

    console.log('test')

    ctx.status = 200
    ctx.body = 'Access granted!'
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
