import { DTO, Prop } from '~/dto'

export class AddCallResponse extends DTO {
    @Prop()
    id!: string

    @Prop()
    entityId!: number

    @Prop()
    entityType!: number

    @Prop()
    accountId!: number

    @Prop({ optional: true })
    requestId?: string
}
