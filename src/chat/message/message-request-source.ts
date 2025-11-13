import { Prop, DTO } from '~/dto'

export class MessageRequestSource extends DTO {
    @Prop()
    externalId!: string
}
