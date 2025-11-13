import { Prop, DTO } from '~/dto'

export class MessageEmbeddedUser extends DTO {
    @Prop()
    id?: string

    @Prop()
    refId?: string

    @Prop()
    name?: string
}
