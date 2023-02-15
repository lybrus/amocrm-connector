import { DTO, Prop } from '~/dto'
import { ChatWebhookActionTyping } from './chat-webhook-action-typing'

export class ChatWebhookAction extends DTO {
    @Prop()
    typing!: ChatWebhookActionTyping
}
