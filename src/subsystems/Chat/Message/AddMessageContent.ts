import {Prop} from '~/decorators'
import {AmoDTO} from '~/core'
import {MessageType} from '../MessageType'

class AddMessageContentLocation extends AmoDTO {
    @Prop()
    lon: number

    @Prop()
    lat: number
}

class AddMessageContentContact extends AmoDTO {
    @Prop()
    name: string

    @Prop()
    phone: string
}

export class AddMessageContent extends AmoDTO {
    @Prop({enum: MessageType})
    type: MessageType

    @Prop({optional: true})
    text?: string

    @Prop({optional: true})
    media?: string

    @Prop({optional: true})
    fileName?: string

    @Prop({optional: true})
    fileSize?: number

    @Prop({optional: true})
    location?: AddMessageContentLocation

    @Prop({optional: true})
    contact?: AddMessageContentContact
}
