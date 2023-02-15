import { Prop, DateSerializerTimestamp, DateSerializerUnixTime, DTO } from '~/dto'
import { AddMessageSource } from './add-message-source'
import { MessageParticipant } from './message-participant'
import { AddMessageContent } from './add-message-content'

export class AddMessagePayload extends DTO {
    @Prop('msgid')
    id!: string

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
    source!: AddMessageSource

    @Prop()
    sender!: MessageParticipant

    @Prop({ optional: true })
    receiver?: MessageParticipant

    @Prop()
    message!: AddMessageContent
}
