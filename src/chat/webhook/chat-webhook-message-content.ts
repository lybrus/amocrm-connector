import { DTO, Prop } from '~/dto'
import { MessageType } from '../message'
import { ChatWebhookMessageMarkup } from './chat-webhook-message-markup'
import { ChatWebhookMessageTemplate } from './chat-webhook-message-template'

export class ChatWebhookMessageContent extends DTO {
    @Prop({ optional: true })
    id!: string

    @Prop({ enum: MessageType })
    type!: MessageType

    @Prop()
    text!: string

    @Prop()
    tag!: string

    @Prop()
    media!: string

    @Prop()
    mediaGroupId!: string

    @Prop()
    thumbnail!: string

    @Prop()
    fileName!: string

    @Prop()
    fileSize!: number

    @Prop()
    markup?: ChatWebhookMessageMarkup

    @Prop({ optional: true })
    template?: ChatWebhookMessageTemplate
}
