import { DTO, Prop } from '~/dto'

export class ChatWebhookSender extends DTO {
    @Prop()
    id!: string
}
