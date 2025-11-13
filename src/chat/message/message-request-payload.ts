import { Prop, DateSerializerTimestamp, DateSerializerUnixTime, DTO } from '~/dto'
import { MessageRequestSource } from './message-request-source'
import { MessageParticipant } from './message-participant'
import { MessageRequestContent } from './message-request-content'
import { MessageReplyTo } from './message-reply-to'
import { MessageForwards } from './message-forwards'

export class MessageRequestPayload extends DTO {
    @Prop('msgid')
    id!: string

    @Prop({ rawPropertyName: 'id', optional: true })
    refId?: string

    @Prop([
        { rawPropertyName: 'timestamp', serializer: DateSerializerTimestamp },
        { rawPropertyName: 'msec_timestamp', serializer: DateSerializerUnixTime }
    ])
    date!: Date

    @Prop()
    conversationId!: string

    @Prop({ optional: true })
    conversationRefId?: string

    @Prop()
    silent = false

    @Prop({ optional: true })
    source!: MessageRequestSource

    @Prop()
    sender!: MessageParticipant

    @Prop({ optional: true })
    receiver?: MessageParticipant

    @Prop()
    message!: MessageRequestContent

    @Prop({ optional: true })
    replyTo?: MessageReplyTo

    @Prop({ optional: true })
    forwards?: MessageForwards
}
