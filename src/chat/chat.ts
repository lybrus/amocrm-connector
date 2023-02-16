import { JSONObject, DTOLike } from '~/dto'
import { AddMessagePayload, AddMessageResponse } from './message'
import { DeliveryStatusRequest } from './delivery-status'
import { TypingRequest } from './typing'
import { Channel } from './channel'

export type ChatOptions = {
    channel: Channel,
    scopeId: string,
    title?: string
}

/**
 * Main Chat API
 */
export class Chat {
    channel: Channel
    scopeId: string
    title?: string

    constructor(chatOptions: ChatOptions) {
        const { channel, scopeId, title } = chatOptions
        this.channel = channel
        this.scopeId = scopeId
        this.title = title
    }

    async addMessage(addMessagePayload: DTOLike<AddMessagePayload>): Promise<AddMessageResponse> {
        const addMessagePayloadImported = AddMessagePayload.create(addMessagePayload)
        const { channel, scopeId } = this
        const { data } = await channel.post<JSONObject>(
            {
                url: `/v2/origin/custom/${scopeId}`,
                data: { event_type: 'new_message', payload: AddMessagePayload.export(addMessagePayloadImported) }
            }
        )

        return AddMessageResponse.import(data)
    }

    async deliveryStatus(messageId: string, deliveryStatusRequest: DTOLike<DeliveryStatusRequest>): Promise<void> {
        const { channel, scopeId } = this
        await channel.post({
            url: `/v2/origin/custom/${scopeId}/${messageId}/delivery_status`,
            data: deliveryStatusRequest,
            dto: DeliveryStatusRequest
        })
    }

    async typing(typingRequest: DTOLike<TypingRequest>) {
        const { channel, scopeId } = this
        await channel.post({
            url: `/v2/origin/custom/${scopeId}/typing`,
            data: typingRequest,
            dto: TypingRequest
        })
    }
}
