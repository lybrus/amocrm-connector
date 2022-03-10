import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'
import {ChatWebhookActionTyping} from './ChatWebhookActionTyping'

export class ChatWebhookAction extends AmoDTO {
    @Prop()
    typing: ChatWebhookActionTyping
}
