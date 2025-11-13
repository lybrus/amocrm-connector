import { Prop, DTO } from '~/dto'

class AddMessageResponseMessage extends DTO {
    @Prop()
    msgid!: string

    @Prop()
    refId!: string

    @Prop()
    conversationId!: string

    @Prop()
    senderId!: string

    @Prop({ optional: true })
    receiverId?: string
}

export class MessageRequestResponse extends DTO {
    @Prop()
    newMessage!: AddMessageResponseMessage
}
