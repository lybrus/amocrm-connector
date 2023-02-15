import { DTO, Prop, DateSerializerTimestamp } from '~/dto'
import { ChatWebhookMessage } from './chat-webhook-message'


export class ChatWebhookMessageRequest extends DTO {
    @Prop()
    accountId!: string

    @Prop({ serializer: DateSerializerTimestamp })
    time!: Date

    @Prop()
    message!: ChatWebhookMessage
}
