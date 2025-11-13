import { Prop, DTO } from '~/dto'
import { MessageEmbeddedMessage } from './message-embedded-message'

export class MessageForwards extends DTO {
    @Prop()
    messages!: MessageEmbeddedMessage[]

    @Prop()
    conversationId!: string

    @Prop({ optional: true })
    conversationRefId?: string
}
