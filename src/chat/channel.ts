import { createHash, createHmac } from 'node:crypto'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ChatWebhookMessageRequest, ChatWebhookTypingRequest } from './webhook'
import EventEmitter from 'events'
import { Request } from 'express'
import { Chat } from './chat'
import { DTO } from '~/dto'
import { Client } from '~/integration'
import { ChatEvents, filtersCheck, Subscribers } from './subscribers'

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

type ChatRequestConfig<D> = AxiosRequestConfig<D> & { dto?: typeof DTO, mainDomain?: string }

/**
 * Main Chat API
 */
export class Channel extends EventEmitter {
    id: string
    private secret: string
    private subscribers: Subscribers = {}
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

    request<T = unknown, D = unknown>(config: ChatRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        const {
            data: rawData,
            headers = {},
            method = 'POST',
            url,
            dto,
            mainDomain = 'amocrm.ru',
            ...rest
        } = config
        const baseURL = `https://amojo.${mainDomain}`
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

    post<T = unknown, D = unknown>(config: ChatRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        return this.request({
            ...config,
            method: 'POST'
        })
    }

    delete<T = unknown, D = unknown>(config: ChatRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        return this.request({
            ...config,
            method: 'DELETE'
        })
    }

    /**
     * Connect channel to account
     * @param client Client or amojoId of account
     * @param title Channel title in account, default value this.title
     * @param isTimeWindowDisabled Indicates if time window enabled or now, default value false
     * @returns Chat instance connected to the account
     */
    async connect(client: Client, title?: string, isTimeWindowDisabled?: boolean): Promise<Chat>
    async connect(amojoId: string, title?: string, isTimeWindowDisabled?: boolean): Promise<Chat>
    async connect(client: string | Client, title?: string, isTimeWindowDisabled = false): Promise<Chat> {
        const { id, title: defaultTitle } = this
        if (!title) title = defaultTitle
        const amojoId = (client instanceof Client) ?
            (await client.account.getAmojoId()) :
            client

        const response = await this.post<{ scope_id: string }>(
            {
                url: `/v2/origin/custom/${id}/connect`,
                data: {
                    account_id: amojoId,
                    title,
                    hook_api_version: 'v2',
                    is_time_window_disabled: isTimeWindowDisabled
                },
            }
        )
        return new Chat({
            channel: this,
            scopeId: response.data.scope_id,
            title
        })
    }

    async disconnect(account: Client): Promise<void>
    async disconnect(amojoId: string): Promise<void>
    async disconnect(account: string | Client): Promise<void> {
        const { id } = this
        const amojoId = (account instanceof Client) ?
            (await account.account.getAmojoId()) :
            account

        await this.delete(
            {
                url: `/v2/origin/custom/${id}/disconnect`,
                data: {
                    account_id: amojoId
                },
            }
        )
    }

    processWebhook(req: Request) {
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

    override on<U extends keyof ChatEvents>(event: U, listener: ChatEvents[U]['cb'], filter?: ChatEvents[U]['filter']): this {
        const listeners = this.subscribers[event] ?
            this.subscribers[event] :
            this.subscribers[event] = new Map() as Subscribers[U]
        listeners?.set(listener, filter)
        return this
    }

    override removeListener<U extends keyof ChatEvents>(event: U, listener: ChatEvents[U]['cb']): this {
        const listeners = this.subscribers[event]
        if (!listeners) return this
        listeners.delete(listener)
        return this
    }

    override emit<U extends keyof ChatEvents>(event: U, ...args: Parameters<ChatEvents[U]['cb']>): boolean {
        const listeners = this.subscribers[event]
        if (!listeners) return false
        for (const [listener, filter] of listeners.entries()) {
            if (filter && !filtersCheck[event](args, filter)) continue
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            listener(...args)
        }
        return true
    }
}
