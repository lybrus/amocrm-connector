/*
* Get token first
*
* Set .env.test variables values (see .env.test.example)
*
* yarn serve (start server to get auth code, get token and save it to file)
* yarn tunnel (public address for your server)
* yarn cypress (run OAuth test)
*
**/

import AmoCRM from '..'
import rawToken from '../testing/token.json'
import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import localtunnel from 'localtunnel'
import {DeliveryErrorCode, DeliveryStatus} from '~/subsystems/Chat/DeliveryStatus'
import {AccountWith} from '~/subsystems/Account'
import {ChatWebhookMessageRequest, ChatWebhookTypingRequest} from '~/subsystems/Chat'
import {MessageType} from '~/subsystems/Chat/MessageType'
import {ChatWebhookMessage} from '../src/subsystems/Chat/Webhook/ChatWebhookMessage'

const domain = process.env.DOMAIN || ''
const integrationId = process.env.INTEGRATION_ID || ''
const secretKey = process.env.SECRET_KEY || ''
const chatSecret = process.env.CHAT_SECRET || ''
const chatId = process.env.CHAT_ID || ''

const {accessUntil, ...rest} = rawToken
const token = {
    accessUntil: new Date(accessUntil),
    ...rest
}

let tunnel: localtunnel.Tunnel

const amocrm = new AmoCRM({
    credential: {
        domain,
        integrationId,
        secretKey,
        chatSecret,
        chatId
    },
    token
})

const senderId = 'sender-id'

;(async () => {
    const {amojoId} = await amocrm.account.get(AccountWith.amojoId)
    if (!amojoId) return
    const scopeId = await amocrm.chat.connectChannel(amojoId, 'Test channel')

    await amocrm.chat.addMessage(
        scopeId,
        {
            date: new Date(),
            conversationId: 'converstation-id',
            sender: {
                id: senderId,
                name: 'Client name',
                profile: {
                    phone: '71234567890'
                }
            },
            id: 'message-id',
            message: {
                type: MessageType.Text,
                text: 'Message test'
            }
        }
    )
})()

const app = new Koa()
const router = new Router()

router.use(koaBody())
app.use(router.routes())


const sendReply = async (scopeId: string, message: ChatWebhookMessage) => {
    const {
        message: {id: messageId, text},
        receiver: {clientId: senderId},
        conversation: {clientId: conversationId}
    } = message

    await amocrm.chat.deliveryStatus(
        scopeId,
        messageId,
        {
            deliveryStatus: DeliveryStatus.Read,
            errorCode: DeliveryErrorCode.Other,
            error: ''
        }
    )

    await amocrm.chat.addMessage(
        scopeId,
        {
            date: new Date(),
            conversationId,
            sender: {
                id: senderId
            },
            id: 'message-id' + Math.random(),
            message: {
                type: MessageType.Text,
                text: `You typed "${text}"`
            }
        }
    )
}

router.post('/amocrm-chat/:scopeId', async ctx => {
    const {scopeId} = ctx.params
    const {body: data, headers} = ctx.request
    const {message, action} = data

    if (!scopeId) return
    if (!amocrm.chat.checkSignature(data, headers['x-signature'])) return

    // New message webhook
    if (message) {
        const messageRequest = ChatWebhookMessageRequest.import(data)

        sendReply(scopeId, messageRequest.message)
    }

    // Typing webhook
    if (action) {
        const typingRequest = ChatWebhookTypingRequest.import(data)

        const {typing: {conversation: {clientId: conversationId}}} = typingRequest.action

        // Echo typing
        amocrm.chat.typing(scopeId, {
            conversationId,
            sender: {id: senderId}
        })
    }
    ctx.status = 200
})

const server = app.listen(0, async () => {
    const address = server?.address()
    if (!address || typeof address === 'string') return
    const {port} = address

    tunnel = await localtunnel({
        port,
        subdomain: process.env.TUNNEL_SUBDOMAIN
    })

    console.log(`listening port ${port}`)
})

process.on('SIGTERM', () => {
    tunnel.close()
    server.close(() => {
        process.exit(0)
    })
})
