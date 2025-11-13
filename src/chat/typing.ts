import { DTO, Prop } from '~/dto'

class TypingRequestSender extends DTO {
    @Prop()
    id!: string
}

export class TypingRequest extends DTO {
    @Prop()
    conversationId!: string

    @Prop()
    sender!: TypingRequestSender

    @Prop()
    durationMs?: number
}
