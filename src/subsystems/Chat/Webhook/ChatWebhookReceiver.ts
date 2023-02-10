import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'

export class ChatWebhookReceiver extends AmoDTO {
    @Prop()
    id!: string

    @Prop({optional: true})
    phone!: string

    @Prop({optional: true})
    email!: string

    @Prop()
    clientId!: string
}
