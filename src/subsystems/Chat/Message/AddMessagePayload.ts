import {Prop} from '~/decorators'
import {DateSerializerTimestamp, DateSerializerUnixTime} from '~/tools/Serializer'
import {AddMessageSource} from './AddMessageSource'
import {MessageParticipant} from './MessageParticipant'
import {AddMessageContent} from './AddMessageContent'
import {AmoDTO} from '~/core'

export class AddMessagePayload extends AmoDTO {
    @Prop('msgid')
    id: string

    @Prop([
        {rawPropertyName: 'timestamp', serializer: DateSerializerTimestamp},
        {rawPropertyName: 'msec_timestamp', serializer: DateSerializerUnixTime}
    ])
    date: Date

    @Prop()
    conversationId: string

    @Prop({optional: true})
    conversationRefId?: string

    @Prop()
    silent: boolean = false

    @Prop({optional: true})
    source: AddMessageSource

    @Prop()
    sender: MessageParticipant

    @Prop({optional: true})
    receiver?: MessageParticipant

    @Prop()
    message: AddMessageContent
}
