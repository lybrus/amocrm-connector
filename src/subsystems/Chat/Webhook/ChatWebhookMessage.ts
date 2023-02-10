import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'
import {DateSerializerTimestamp, DateSerializerUnixTime} from '~/tools/Serializer'
import {ChatWebhookMessageConversation} from './ChatWebhookMessageConversation'
import {ChatWebhookSource} from './ChatWebhookSource'
import {ChatWebhookSender} from './ChatWebhookSender'
import {ChatWebhookReceiver} from './ChatWebhookReceiver'
import {ChatWebhookMessageContent} from './ChatWebhookMessageContent'

export class ChatWebhookMessage extends AmoDTO {
    @Prop()
    conversation!: ChatWebhookMessageConversation

    @Prop({optional: true})
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
