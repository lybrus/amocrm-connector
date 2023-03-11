import { DateSerializerTimestamp, DTO, Prop } from '~/dto'

export enum CallDirection {
    Inbound = 'inbound',
    Outbound = 'outbound'
}

export enum CallStatus {
    LeftAMessage = 1,
    CallbackLater = 2,
    NotAvailable = 3,
    HadAConversation = 4,
    InvalidPhoneNumber = 5,
    NoConnection = 6,
    TheLineIsBusy = 7
}

export class AddCallRequest extends DTO {
    @Prop({ enum: CallDirection })
    direction!: CallDirection

    @Prop({ rawPropertyName: 'uniq', optional: true })
    id?: string

    @Prop()
    duration!: number

    @Prop()
    source!: string

    @Prop({ optional: true })
    link?: string

    @Prop()
    phone!: string

    @Prop({ optional: true })
    callResponsible?: string | number

    @Prop({ optional: true })
    callResult?: string

    @Prop({ enum: CallStatus, optional: true })
    callStatus?: CallStatus

    @Prop({ optional: true })
    responsibleUserId?: number

    @Prop({ optional: true })
    createdBy?: number

    @Prop({ optional: true })
    updatedBy?: number

    @Prop({ serializer: DateSerializerTimestamp })
    createdAt!: Date

    @Prop({ serializer: DateSerializerTimestamp, optional: true })
    updatedAt?: Date

    @Prop({ optional: true })
    requestId?: string
}
