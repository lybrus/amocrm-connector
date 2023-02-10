import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'

export class ChatWebhookMessageConversation extends AmoDTO {
    @Prop()
    id!: string

    @Prop()
    clientId!: string
}
