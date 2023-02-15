import { DTO, Prop } from '~/dto'

export class ChatWebhookMessageTemplateParam extends DTO {
    @Prop()
    key!: string

    @Prop()
    value!: string
}

export class ChatWebhookMessageTemplate extends DTO {
    @Prop()
    id!: string

    @Prop()
    externalId!: string

    @Prop()
    content!: string

    @Prop({ type: ChatWebhookMessageTemplateParam })
    params!: ChatWebhookMessageTemplateParam[]
}
