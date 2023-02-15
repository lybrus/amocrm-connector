import { DTO, Prop } from '~/dto'

export class ChatWebhookReceiver extends DTO {
    @Prop()
    id!: string

    @Prop({ optional: true })
    phone!: string

    @Prop({ optional: true })
    email!: string

    @Prop()
    clientId!: string
}
