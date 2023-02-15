import { Prop, DTO } from '~/dto'
import { MessageType } from './message-type'

class AddMessageContentLocation extends DTO {
    @Prop()
    lon!: number

    @Prop()
    lat!: number
}

class AddMessageContentContact extends DTO {
    @Prop()
    name!: string

    @Prop()
    phone!: string
}

export class AddMessageContent extends DTO {
    @Prop({ enum: MessageType })
    type!: MessageType

    @Prop({ optional: true })
    text?: string

    @Prop({ optional: true })
    media?: string

    @Prop({ optional: true })
    fileName?: string

    @Prop({ optional: true })
    fileSize?: number

    @Prop({ optional: true })
    location?: AddMessageContentLocation

    @Prop({ optional: true })
    contact?: AddMessageContentContact
}
