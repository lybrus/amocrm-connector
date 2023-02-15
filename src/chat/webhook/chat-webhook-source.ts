import { DTO, Prop } from '~/dto'

export class ChatWebhookSource extends DTO {
    @Prop()
    externalId!: string
}
