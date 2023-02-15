import { DTO, Prop } from '~/dto'

export class ChatWebhookMessageConversation extends DTO {
    @Prop()
    id!: string

    @Prop()
    clientId!: string
}
