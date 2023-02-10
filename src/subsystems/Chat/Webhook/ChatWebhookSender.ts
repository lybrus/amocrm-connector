import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'

export class ChatWebhookSender extends AmoDTO {
    @Prop()
    id!: string
}
