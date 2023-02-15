import { DTO, Prop, DateSerializerTimestamp } from '~/dto'
import { ChatWebhookSender } from './chat-webhook-sender'
import { ChatWebhookMessageConversation } from './chat-webhook-message-conversation'

export class ChatWebhookActionTyping extends DTO {
    @Prop()
    user!: ChatWebhookSender

    @Prop()
    conversation!: ChatWebhookMessageConversation

    @Prop({ serializer: DateSerializerTimestamp })
    expiredAt!: Date
}
