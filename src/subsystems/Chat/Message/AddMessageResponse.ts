import {Prop} from '~/decorators'
import {AmoDTO} from '~/core'

class AddMessageResponseMessage extends AmoDTO {
    @Prop()
    msgid: string

    @Prop()
    refId: string
}

export class AddMessageResponse extends AmoDTO {
    @Prop()
    newMessage: AddMessageResponseMessage
}
