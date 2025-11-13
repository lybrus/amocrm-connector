import { DateSerializerTimestamp, DateSerializerUnixTime, DTO, Prop } from '~/dto'
import { MessageType } from './message-type'
import { AddMessageContentContact, AddMessageContentLocation } from './message-request-content'
import { MessageEmbeddedUser } from './message-embedded-user'

export class MessageEmbeddedMessage extends DTO {
    @Prop({ rawPropertyName: 'msgid', optional: true })
    id?: string

    @Prop({ rawPropertyName: 'id', optional: true })
    refId?: string

    @Prop({ enum: MessageType })
    type!: MessageType

    @Prop({ optional: true })
    text?: string

    @Prop({ optional: true })
    media?: string

    @Prop({ optional: true })
    fileName?: string

    @Prop({ optional: true })
    fileSize?: number

    @Prop({ optional: true })
    location?: AddMessageContentLocation

    @Prop({ optional: true })
    contact?: AddMessageContentContact

    @Prop([
        { rawPropertyName: 'timestamp', serializer: DateSerializerTimestamp, optional: true },
        { rawPropertyName: 'msec_timestamp', serializer: DateSerializerUnixTime, optional: true }
    ])
    date?: Date

    @Prop()
    sender!: MessageEmbeddedUser
}