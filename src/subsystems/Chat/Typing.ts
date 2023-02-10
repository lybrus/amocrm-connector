import {AmoDTO} from '~/core'
import {Prop} from "~/decorators";
import {MessageParticipant} from './Message'

export class TypingRequest extends AmoDTO {
    @Prop()
    conversationId!: string

    @Prop()
    sender!: MessageParticipant
}
