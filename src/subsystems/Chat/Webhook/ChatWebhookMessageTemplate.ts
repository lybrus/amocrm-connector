import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'

export class ChatWebhookMessageTemplateParam extends AmoDTO {
    @Prop()
    key: string

    @Prop()
    value: string
}

export class ChatWebhookMessageTemplate extends AmoDTO {
    @Prop()
    id: string

    @Prop()
    externalId: string

    @Prop()
    content: string

    @Prop({type: ChatWebhookMessageTemplateParam})
    params: ChatWebhookMessageTemplateParam[]
}
