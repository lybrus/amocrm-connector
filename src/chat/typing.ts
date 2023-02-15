import { DTO, Prop } from '~/dto'
import { MessageParticipant } from './message'

export class TypingRequest extends DTO {
    @Prop()
    conversationId!: string

    @Prop()
    sender!: MessageParticipant
}
