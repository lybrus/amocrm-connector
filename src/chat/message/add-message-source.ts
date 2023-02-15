import { Prop, DTO } from '~/dto'

export class AddMessageSource extends DTO {
    @Prop()
    externalId!: string
}
