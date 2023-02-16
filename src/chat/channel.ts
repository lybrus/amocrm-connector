import { createHash, createHmac } from 'node:crypto'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ChatWebhookMessageRequest, ChatWebhookTypingRequest } from './webhook'
import EventEmitter from 'events'
import { Request } from 'express'
import { Chat } from './chat'
import { DTO } from '~/dto'

export type ChatCredential = {
    /**
     * Chat secret given at channel creation
     */
    chatSecret: string,
    /**
     * Chat id given at channel creation
     */
    chatId: string,
    /**
     * Default title for connectChannel method
     */
    title: string,
}

export interface ChatEvents {
    'message': (chat: Chat, messageRequest: ChatWebhookMessageRequest) => void;
    'typing': (chat: Chat, typingRequest: ChatWebhookTypingRequest) => void;
}

type ChatRequestConfig<D> = AxiosRequestConfig<D> & { dto?: typeof DTO }

/**
 * Main Chat API
 */
export class Channel extends EventEmitter {
    private id: string
    private secret: string
    public title: string

    constructor(chatCredentials: ChatCredential) {
        super()

        const { chatId, chatSecret, title } = chatCredentials
        this.id = chatId
        this.secret = chatSecret
        this.title = title
    }

    checkSignature(body: unknown, signature?: string): boolean {
        if (!signature) return false
        const { secret } = this
        return createHmac('sha1', secret)
            .update(JSON.stringify(body))
            .digest('hex')
            .toLowerCase() === signature
    }

    post<T = unknown, D = unknown>(config: ChatRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        const {
            data: rawData,
            headers = {},
            method = 'GET',
            url,
            dto,
            ...rest
        } = config
        const baseURL = 'https://amojo.amocrm.ru'
        const { secret } = this

        const data = (dto && rawData) ? dto.process(rawData) : rawData

        headers['Date'] = (new Date()).toUTCString()
        headers['Content-Type'] = 'application/json'
        headers['Content-MD5'] = createHash('md5')
            .update(JSON.stringify(data || ''))
            .digest('hex')
            .toLowerCase()
        headers['X-Signature'] = createHmac('sha1', secret)
            .update(
                [
                    method.toUpperCase(),
                    ...(Object.keys(headers).sort().map(k => headers[k])),
                    url
                ].join('\n')
            )
            .digest('hex')
            .toLowerCase()

        return axios({ baseURL, headers, data, method, url, ...rest })
    }

    /**
     * Connect channel to account
     * @param amojoId Amo CRM account id for chat API
     * @param title? Channel title in account, default value this.title
     * @returns Chat instance connected to the account
     */
    async connectChannel(amojoId: string, title?: string): Promise<Chat> {
        const { id, title: defaultTitle } = this
        if (!title) title = defaultTitle
        const response = await this.post<{ scope_id: string }>(
            {
                url: `/v2/origin/custom/${id}/connect`,
                data: {
                    account_id: amojoId,
                    title,
                    hook_api_version: 'v2'
                },
            }
        )
        return new Chat({
            channel: this,
            scopeId: response.data.scope_id,
            title
        })
    }

    handle(req: Request) {
        const urlParts = req.originalUrl.split('/')
        const scopeId = urlParts[urlParts.length - 1]
        if (!scopeId) return

        const { body: data, headers } = req
        const signature = headers['x-signature']
        if (typeof signature !== 'string' || !this.checkSignature(data, signature)) return

        const chat = new Chat({
            channel: this,
            scopeId
        })

        const { message, action } = data

        // New message webhook
        if (message) {
            const messageRequest = ChatWebhookMessageRequest.import(data)
            this.emit('message', chat, messageRequest)
        }

        // Typing webhook
        if (action) {
            const typingRequest = ChatWebhookTypingRequest.import(data)
            this.emit('typing', chat, typingRequest)
        }
    }

    override on<U extends keyof ChatEvents>(event: U, listener: ChatEvents[U]): this {
        super.on(event, listener)
        return this
    }

    override removeListener<U extends keyof ChatEvents>(event: U, listener: ChatEvents[U]): this {
        super.removeListener(event, listener)
        return this
    }
}