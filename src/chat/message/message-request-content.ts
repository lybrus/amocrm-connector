import { Prop, DTO } from '~/dto'
import { MessageType } from './message-type'
import { DeliveryStatus } from '~/chat/delivery-status'
import { MessageSharedPost } from './message-shared-post'

export class AddMessageContentLocation extends DTO {
    @Prop()
    lon!: number

    @Prop()
    lat!: number
}

export class AddMessageContentContact extends DTO {
    @Prop()
    name!: string

    @Prop()
    phone!: string
}

export class MessageRequestContent extends DTO {
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
    stickerId?: string

    @Prop({ optional: true })
    location?: AddMessageContentLocation

    @Prop({ optional: true })
    contact?: AddMessageContentContact

    @Prop()
    callbackData?: string

    @Prop({ optional: true })
    deliverStatus?: DeliveryStatus

    @Prop()
    mediaDuration?: number

    @Prop({ optional: true })
    sharedPost?: MessageSharedPost
}
