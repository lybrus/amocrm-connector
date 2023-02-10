import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'
import {MessageType} from '../MessageType'
import {ChatWebhookMessageMarkup} from './ChatWebhookMessagMarkup'
import {ChatWebhookMessageTemplate} from './ChatWebhookMessageTemplate'

export class ChatWebhookMessageContent extends AmoDTO {
    @Prop({optional: true})
    id!: string

    @Prop({enum: MessageType})
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

    @Prop({optional: true})
    template?: ChatWebhookMessageTemplate
}
