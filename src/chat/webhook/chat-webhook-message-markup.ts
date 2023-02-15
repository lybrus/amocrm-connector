import { DTO, Prop } from '~/dto'

export enum MessageMarkupMode {
    Inline = 'inline'
}

export class ChatWebhookMessageMarkupButton extends DTO {
    @Prop()
    text!: string

    @Prop()
    url!: string
}

export class ChatWebhookMessageMarkup extends DTO {
    @Prop({ enum: MessageMarkupMode })
    mode!: MessageMarkupMode

    @Prop({ type: ChatWebhookMessageMarkupButton })
    buttons!: ChatWebhookMessageMarkupButton[][]
}
