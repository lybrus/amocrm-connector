import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'
import {DateSerializerTimestamp} from '~/tools/Serializer'
import {ChatWebhookSender} from './ChatWebhookSender'
import {ChatWebhookMessageConversation} from './ChatWebhookMessageConversation'

export class ChatWebhookActionTyping extends AmoDTO {
    @Prop()
    user: ChatWebhookSender

    @Prop()
    conversation: ChatWebhookMessageConversation

    @Prop({serializer: DateSerializerTimestamp})
    expiredAt: Date
}
