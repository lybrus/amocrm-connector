import { JSONObject, DTOLike } from '~/dto'
import CryptoJS from 'crypto-js'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { AddMessagePayload, AddMessageResponse } from './message'
import { DeliveryStatusRequest } from './delivery-status'
import { TypingRequest } from './typing'
import { ChatWebhookMessageRequest, ChatWebhookTypingRequest } from './webhook'
import EventEmitter from 'events'
import { Request } from 'express'


export type ChatCredential = {
    chatSecret: string,
    chatId: string,
    title: string,
    amojoId: string
}

export interface ChatEvents {
    'message': (scopeId: string, messageRequest: ChatWebhookMessageRequest) => void;
    'typing': (scopeId: string, typingRequest: ChatWebhookTypingRequest) => void;
}

type ChatRequestConfig<D> = AxiosRequestConfig<D>

export class Chat extends EventEmitter {
    constructor(private chatCredentials: ChatCredential) {
        super()
    }

    checkSignature(body: unknown, signature?: string | string[]): boolean {
        if (!signature || signature instanceof Array) return false
        const { chatCredentials: { chatSecret } } = this

        return CryptoJS
            .HmacSHA1(JSON.stringify(body), chatSecret)
            .toString(CryptoJS.enc.Hex)
            .toLowerCase() === signature
    }

    request<T = unknown, D = unknown>(config: ChatRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        const {
            data,
            headers = {},
            method = 'GET',
            url,
            ...rest
        } = config
        const baseURL = 'https://amojo.amocrm.ru'
        const { chatCredentials: { chatSecret } } = this

        headers['Date'] = (new Date()).toUTCString()
        headers['Content-Type'] = 'application/json'
        headers['Content-MD5'] = CryptoJS.MD5(JSON.stringify(data || '')).toString(CryptoJS.enc.Hex).toLowerCase()
        headers['X-Signature'] = CryptoJS
            .HmacSHA1(
                [
                    method.toUpperCase(),
                    ...(Object.keys(headers).sort().map(k => headers[k])),
                    url
                ].join('\n'), chatSecret
            )
            .toString(CryptoJS.enc.Hex)
            .toLowerCase()

        return axios({ baseURL, headers, data, method, url, ...rest })
    }

    get<T = unknown, D = unknown>(config: ChatRequestConfig<D>) {
        return this.request<T, D>({ method: 'GET', ...config })
    }

    post<T = unknown, D = unknown>(config: ChatRequestConfig<D>) {
        return this.request<T, D>({ method: 'POST', ...config })
    }

    async connectChannel(amojoId: string, title?: string): Promise<string> {
        const { chatCredentials: { chatId, title: defaultTitle } } = this
        const response = await this.post<{ scope_id: string }>(
            {
                url: `/v2/origin/custom/${chatId}/connect`,
                data: {
                    account_id: amojoId,
                    title: title || defaultTitle,
                    hook_api_version: 'v2'
                },
            }
        )
        return response.data.scope_id
    }

    async addMessage(scopeId: string, addMessagePayload: DTOLike<AddMessagePayload>): Promise<AddMessageResponse> {
        const addMessagePayloadImported = AddMessagePayload.create(addMessagePayload)
        const { data } = await this.post<JSONObject>(
            {
                url: `/v2/origin/custom/${scopeId}`,
                data: { event_type: 'new_message', payload: AddMessagePayload.export(addMessagePayloadImported) }
            }
        )

        return AddMessageResponse.import(data)
    }

    async deliveryStatus(scopeId: string, messageId: string, deliveryStatusRequest: DTOLike<DeliveryStatusRequest>): Promise<void> {
        const deliveryStatusRequestImported = DeliveryStatusRequest.create(deliveryStatusRequest)
        await this.post({
            url: `/v2/origin/custom/${scopeId}/${messageId}/delivery_status`,
            data: DeliveryStatusRequest.export(deliveryStatusRequestImported)
        })
    }

    async typing(scopeId: string, typingRequest: DTOLike<TypingRequest>) {
        const typingRequestImported = TypingRequest.create(typingRequest)
        await this.post({
            url: `/v2/origin/custom/${scopeId}/typing`,
            data: TypingRequest.export(typingRequestImported)
        })
    }

    handle(req: Request) {
        const urlParts = req.originalUrl.split('/')
        const scopeId = urlParts[urlParts.length - 1]
        const { body: data, headers } = req
        const { message, action } = data

        if (!this.checkSignature(data, headers['x-signature'])) return

        // New message webhook
        if (message) {
            const messageRequest = ChatWebhookMessageRequest.import(data)

            this.emit('message', scopeId, messageRequest)
        }

        // Typing webhook
        if (action) {
            const typingRequest = ChatWebhookTypingRequest.import(data)

            this.emit('typing', scopeId, typingRequest)
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









