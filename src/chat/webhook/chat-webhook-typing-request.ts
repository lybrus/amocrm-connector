import { DTO, Prop, DateSerializerTimestamp } from '~/dto'
import { ChatWebhookAction } from './chat-webhook-action'

export class ChatWebhookTypingRequest extends DTO {
    @Prop()
    accountId!: string

    @Prop({ serializer: DateSerializerTimestamp })
    time!: Date

    @Prop()
    action!: ChatWebhookAction
}
