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

import token from '../testing/token.json'
import express from 'express'
import bodyParser from 'body-parser'
import localtunnel from 'localtunnel'
import {
    DeliveryErrorCode,
    DeliveryStatus,
    MessageType,
    ChatWebhookMessage,
    Integration,
    Client, Channel, Chat
} from '..'

const subdomain = process.env.SUBDOMAIN || ''
const integrationId = process.env.INTEGRATION_ID || ''
const secretKey = process.env.SECRET_KEY || ''
const redirectUri = process.env.REDIRECT_URI || ''

const chatId = process.env.CHAT_ID || ''
const chatSecret = process.env.CHAT_SECRET || ''

let tunnel: localtunnel.Tunnel

const integration = new Integration({
    integrationId,
    secretKey,
    redirectUri
})

const client = new Client({
    integration,
    subdomain,
    token
})

const channel = new Channel({
    chatId,
    chatSecret,
    title: 'Test channel'
})

const senderId = 'sender-id'

;(async () => {
    const chat = await channel.connect(client)

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

channel.on('message', async (chat, messageRequest) => {
    await sendReply(chat, messageRequest.message)
})

channel.on('typing', async (chat, typingRequest) => {
    const { typing: { conversation: { clientId: conversationId } } } = typingRequest.action

    // Echo typing
    await chat.typing({
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
                text: `You sent "${text}"`
            }
        }
    )
}

const app = express()
app.use(bodyParser.json())
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
        subdomain: process.env.TUNNEL_SUBDOMAIN,
        host: `https://${process.env.TUNNEL_HOST}`
    })

    console.log(`${tunnel.url} -> http://localhost:${port}`)
})

process.on('SIGTERM', () => {
    tunnel.close()
    server.close(() => {
        process.exit(0)
    })
})
