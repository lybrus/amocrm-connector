/*
* Get token first
*
* Set .env.test variables values (see .env.test.example)
*
* yarn serve (start server to get auth code, get token and save it to file)
* yarn tunnel (public address for your server)
* yarn cypress (run OAuth test)
*
* stop server, this application uses the same port
*
**/
import 'reflect-metadata'
import token from '../testing/token.json'
import express from 'express'
import bodyParser from 'body-parser'
import {
    Channel,
    Chat,
    ChatWebhookMessage,
    Client,
    DeliveryErrorCode,
    DeliveryStatus,
    Integration,
    MessageType,
    LeadWithParams
} from '..'

// import { isClassLikeDeclaration } from 'ts-api-utils'

const subdomain = process.env.SUBDOMAIN || ''
const integrationId = process.env.INTEGRATION_ID || ''
const secretKey = process.env.SECRET_KEY || ''
const redirectUri = process.env.REDIRECT_URI || ''

const chatId = process.env.CHAT_ID || ''
const chatSecret = process.env.CHAT_SECRET || ''
const chatPath = process.env.CHAT_PATH || '/amo/:scopeId'

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

let typingSenderId: string | undefined = undefined

;(async () => {
    for await(const lead of client.leads.iterateAll({
        withParams: [LeadWithParams.Contacts]
    })) {
        console.log(lead)
    }

    const chat = await channel.connect(client)

    await chat.addMessage(
        {
            date: new Date(),
            conversationId: 'converstation-id',
            sender: {
                id: 'sender-id',
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
    if (!typingSenderId) return

    const { typing: { conversation: { clientId: conversationId } } } = typingRequest.action
    // Echo typing
    await chat.typing({
        conversationId,
        sender: { id: typingSenderId }
    })
})


const sendReply = async (chat: Chat, message: ChatWebhookMessage) => {
    const {
        message: { id: messageId, text },
        receiver: { clientId: senderId },
        conversation: { clientId: conversationId }
    } = message

    typingSenderId = senderId

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
app.post(chatPath, async (req, res) => {
    channel.processWebhook(req)
    res.end()
})

const server = app.listen(process.env.SERVER_PORT, async () => {
    const address = server?.address()
    if (!address || typeof address === 'string') return
})

process.on('SIGTERM', () => {
    server.close(() => {
        process.exit(0)
    })
})
