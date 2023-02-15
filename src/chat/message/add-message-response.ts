import { Prop, DTO } from '~/dto'

class AddMessageResponseMessage extends DTO {
    @Prop()
    msgid!: string

    @Prop()
    refId!: string
}

export class AddMessageResponse extends DTO {
    @Prop()
    newMessage!: AddMessageResponseMessage
}
