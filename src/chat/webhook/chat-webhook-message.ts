import { DTO, Prop, DateSerializerTimestamp, DateSerializerUnixTime } from '~/dto'
import { ChatWebhookMessageConversation } from './chat-webhook-message-conversation'
import { ChatWebhookSource } from './chat-webhook-source'
import { ChatWebhookSender } from './chat-webhook-sender'
import { ChatWebhookReceiver } from './chat-webhook-receiver'
import { ChatWebhookMessageContent } from './chat-webhook-message-content'

export class ChatWebhookMessage extends DTO {
    @Prop()
    conversation!: ChatWebhookMessageConversation

    @Prop({ optional: true })
    source?: ChatWebhookSource

    @Prop()
    sender!: ChatWebhookSender

    @Prop()
    receiver!: ChatWebhookReceiver

    @Prop([
        {
            rawPropertyName: 'msec_timestamp',
            serializer: DateSerializerUnixTime
        },
        {
            rawPropertyName: 'timestamp',
            serializer: DateSerializerTimestamp
        }
    ])
    date!: Date

    @Prop()
    message!: ChatWebhookMessageContent
}
