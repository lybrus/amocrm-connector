import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'

export enum MessageMarkupMode {
    Inline = 'inline'
}

export class ChatWebhookMessageMarkupButton extends AmoDTO {
    @Prop()
    text: string

    @Prop()
    url: string
}

export class ChatWebhookMessageMarkup extends AmoDTO {
    @Prop({enum: MessageMarkupMode})
    mode: MessageMarkupMode

    @Prop({type: ChatWebhookMessageMarkupButton})
    buttons: ChatWebhookMessageMarkupButton[][]
}
