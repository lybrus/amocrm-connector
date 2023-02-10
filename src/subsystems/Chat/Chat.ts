import {Subsystem} from '~/subsystems'
import {JSONObject} from '~/tools/types/json'
import CryptoJS from 'crypto-js'
import {AmoCRMRequestConfig} from '~/tools/types/amocrm'
import {AxiosResponse} from 'axios'
import {AddMessagePayload, AddMessageResponse} from './Message'
import {DeliveryStatusRequest} from './DeliveryStatus'
import {TypingRequest} from './Typing'
import {AmoLike} from '~/tools/types/AmoLike'
import {Request} from 'express'
import {ChatWebhookMessageRequest, ChatWebhookTypingRequest} from "~/subsystems/Chat/Webhook";
import EventEmitter from "events";

export interface ChatEvents {
    'message': (scopeId: string, messageRequest: ChatWebhookMessageRequest) => void;
    'typing': (scopeId: string, typingRequest: ChatWebhookTypingRequest) => void;
}

export class Chat extends Subsystem {
    private eventEmitter = new EventEmitter()

    checkSignature(body: unknown, signature?: string | string[]): boolean {
        if (!signature || signature instanceof Array) return false
        const {amocrm} = this

        return CryptoJS
            .HmacSHA1(JSON.stringify(body), amocrm.credential?.chatSecret || '')
            .toString(CryptoJS.enc.Hex)
            .toLowerCase() === signature
    }

    request<T = unknown, D = unknown>(config: AmoCRMRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        const {
            useToken = true,
            ifModifiedSince,
            data,
            headers = {},
            method = 'GET',
            url,
            baseURL = 'https://amojo.amocrm.ru',
            ...rest
        } = config
        const {amocrm} = this

        headers['Date'] = (new Date()).toUTCString()
        headers['Content-Type'] = 'application/json'
        headers['Content-MD5'] = CryptoJS.MD5(JSON.stringify(data || '')).toString(CryptoJS.enc.Hex).toLowerCase()
        headers['X-Signature'] = CryptoJS
            .HmacSHA1(
                [
                    method.toUpperCase(),
                    ...(Object.keys(headers).sort().map(k => headers[k])),
                    url
                ].join('\n'), amocrm.credential?.chatSecret || ''
            )
            .toString(CryptoJS.enc.Hex)
            .toLowerCase()

        return amocrm.request({baseURL, headers, data, method, url, ...rest})
    }

    get<T = unknown, D = unknown>(config: AmoCRMRequestConfig<D>) {
        return this.request<T, D>({method: 'GET', ...config})
    }

    post<T = unknown, D = unknown>(config: AmoCRMRequestConfig<D>) {
        return this.request<T, D>({method: 'POST', ...config})
    }

    async connectChannel(amojoId: string, title: string): Promise<string> {
        const {amocrm} = this
        const response = await this.post<{ scope_id: string }>(
            {
                url: `/v2/origin/custom/${amocrm.credential.chatId}/connect`,
                data: {
                    account_id: amojoId,
                    title,
                    hook_api_version: 'v2'
                },
            }
        )
        return response.data.scope_id
    }

    async addMessage(scopeId: string, addMessagePayload: AmoLike<AddMessagePayload>): Promise<AddMessageResponse> {
        const addMessagePayloadImported = AddMessagePayload.create(addMessagePayload)
        const {data} = await this.post<JSONObject>(
            {
                url: `/v2/origin/custom/${scopeId}`,
                data: {event_type: 'new_message', payload: AddMessagePayload.export(addMessagePayloadImported)}
            }
        )

        return AddMessageResponse.import(data)
    }

    async deliveryStatus(scopeId: string, messageId: string, deliveryStatusRequest: AmoLike<DeliveryStatusRequest>): Promise<void> {
        const deliveryStatusRequestImported = DeliveryStatusRequest.create(deliveryStatusRequest)
        await this.post({
            url: `/v2/origin/custom/${scopeId}/${messageId}/delivery_status`,
            data: DeliveryStatusRequest.export(deliveryStatusRequestImported)
        })
    }

    async typing(scopeId: string, typingRequest: AmoLike<TypingRequest>) {
        const typingRequestImported = TypingRequest.create(typingRequest)
        await this.post({
            url: `/v2/origin/custom/${scopeId}/typing`,
            data: TypingRequest.export(typingRequestImported)
        })
    }

    handle(req: Request) {
        const {scopeId} = req.params
        const {body: data, headers} = req
        const {message, action} = data

        if (!this.checkSignature(data, headers['x-signature'])) return

        // New message webhook
        if (message) {
            const messageRequest = ChatWebhookMessageRequest.import(data)

            this.eventEmitter.emit('message', scopeId, messageRequest)
        }

        // Typing webhook
        if (action) {
            const typingRequest = ChatWebhookTypingRequest.import(data)

            this.eventEmitter.emit('typing', scopeId, typingRequest)
        }
    }

    on<U extends keyof ChatEvents>(event: U, listener: ChatEvents[U]): this {
        this.eventEmitter.on(event, listener)
        return this
    }

    removeListener<U extends keyof ChatEvents>(event: U, listener: ChatEvents[U]): this {
        this.eventEmitter.removeListener(event, listener)
        return this
    }
}









