import { Prop, DTO } from '~/dto'
import { MessageEmbeddedMessage } from './message-embedded-message'

export class MessageReplyTo extends DTO {
    @Prop()
    message!: MessageEmbeddedMessage
}
