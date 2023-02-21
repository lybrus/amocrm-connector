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

import rawToken from '../testing/token.json'
import express from 'express'
import localtunnel from 'localtunnel'
import {
    DeliveryErrorCode,
    DeliveryStatus,
    MessageType,
    ChatWebhookMessage,
    Integration,
    Client, Channel, Chat
} from '..'

const domain = process.env.DOMAIN || ''
const integrationId = process.env.INTEGRATION_ID || ''
const secretKey = process.env.SECRET_KEY || ''
const redirectUri = process.env.REDIRECT_URI || ''

const chatId = process.env.CHAT_ID || ''
const chatSecret = process.env.CHAT_SECRET || ''

const { accessUntil, ...rest } = rawToken
const token = {
    accessUntil: new Date(accessUntil),
    ...rest
}

let tunnel: localtunnel.Tunnel

const integration = new Integration({
    integrationId,
    secretKey,
    redirectUri
})

const client = new Client({
    integration,
    domain,
    token
})

const channel = new Channel({
    chatId,
    chatSecret,
    title: 'Test channel'
})

const senderId = 'sender-id'

;(async () => {
    const chat = await channel.connectChannel(client)

    await chat.addMessage(
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

channel.on('message', (chat, messageRequest) => {
    sendReply(chat, messageRequest.message)
})

channel.on('typing', (chat, typingRequest) => {
    const { typing: { conversation: { clientId: conversationId } } } = typingRequest.action

    // Echo typing
    chat.typing({
        conversationId,
        sender: { id: senderId }
    })
})


const sendReply = async (chat: Chat, message: ChatWebhookMessage) => {
    const {
        message: { id: messageId, text },
        receiver: { clientId: senderId },
        conversation: { clientId: conversationId }
    } = message

    await chat.deliveryStatus(
        messageId,
        {
            deliveryStatus: DeliveryStatus.Read,
            errorCode: DeliveryErrorCode.Other,
            error: ''
        }
    )

    await chat.addMessage(
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

const app = express()
app.post('/amo/:scopeId', async (req, res) => {
    channel.processWebhook(req)
    res.end()
})

const server = app.listen(0, async () => {
    const address = server?.address()
    if (!address || typeof address === 'string') return
    const { port } = address

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
