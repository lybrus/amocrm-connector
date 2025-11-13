import { DTOLike, JSONObject } from '~/dto'
import { MessageRequestEventType, MessageRequestPayload, MessageRequestResponse } from './message'
import { DeliveryStatusRequest } from './delivery-status'
import { TypingRequest } from './typing'
import { Channel } from './channel'
import { CreateConversationRequest, CreateConversationResponse } from './conversation'

export type ChatOptions = {
    channel: Channel,
    scopeId: string,
    title?: string,
    mainDomain?: string
}

export type ChatDescription = {
    scopeId: string
}

/**
 * Main Chat API
 */
export class Chat {
    channel: Channel
    scopeId: string
    title?: string
    mainDomain: string

    constructor(chatOptions: ChatOptions) {
        const {
            channel, scopeId, title,
            mainDomain = 'amocrm.ru'
        } = chatOptions
        this.channel = channel
        this.scopeId = scopeId
        this.title = title
        this.mainDomain = mainDomain
    }

    async createConversation(request: CreateConversationRequest): Promise<CreateConversationResponse> {
        const { channel, scopeId, mainDomain } = this

        const { data } = await channel.post<JSONObject>(
            {
                url: `/v2/origin/custom/${scopeId}/chats`,
                mainDomain,
                data: MessageRequestPayload.export(request)
            }
        )

        return CreateConversationResponse.import(data)
    }

    async messageRequest(
        payload: DTOLike<MessageRequestPayload>,
        eventType: MessageRequestEventType = MessageRequestEventType.NewMessage): Promise<MessageRequestResponse>
    {
        const addMessagePayloadImported = MessageRequestPayload.create(payload)
        const { channel, scopeId, mainDomain } = this
        const { data } = await channel.post<JSONObject>(
            {
                url: `/v2/origin/custom/${scopeId}`,
                mainDomain,
                data: { event_type: eventType, payload: MessageRequestPayload.export(addMessagePayloadImported) }
            }
        )

        return MessageRequestResponse.import(data)
    }

    async addMessage(payload: DTOLike<MessageRequestPayload>): Promise<MessageRequestResponse> {
        return this.messageRequest(payload)
    }

    async deliveryStatus(messageId: string, deliveryStatusRequest: DTOLike<DeliveryStatusRequest>): Promise<void> {
        const { channel, scopeId, mainDomain } = this
        await channel.post({
            url: `/v2/origin/custom/${scopeId}/${messageId}/delivery_status`,
            mainDomain,
            data: deliveryStatusRequest,
            dto: DeliveryStatusRequest
        })
    }

    async typing(typingRequest: DTOLike<TypingRequest>) {
        const { channel, scopeId, mainDomain } = this
        await channel.post({
            url: `/v2/origin/custom/${scopeId}/typing`,
            mainDomain,
            data: typingRequest,
            dto: TypingRequest
        })
    }

    async getHistory() {

    }
}
