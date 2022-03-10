import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'
import {DateSerializerTimestamp} from '~/tools/Serializer'
import {ChatWebhookMessage} from './ChatWebhookMessage'


export class ChatWebhookMessageRequest extends AmoDTO {
    @Prop()
    accountId: string

    @Prop({serializer: DateSerializerTimestamp})
    time: Date

    @Prop()
    message: ChatWebhookMessage
}
