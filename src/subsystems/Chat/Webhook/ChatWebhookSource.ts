import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'

export class ChatWebhookSource extends AmoDTO {
    @Prop()
    externalId: string
}
