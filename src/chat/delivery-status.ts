import { DTO, Prop } from '~/dto'

export enum DeliveryStatus {
    Sent = 0,
    Delivered = 1,
    Read = 2,
    Error = -1
}

export enum DeliveryErrorCode {
    No = 0,
    ChatWasDelete = 901,
    IntegrationWasSwitchedOff = 902,
    InternalServerError = 903,
    UnableToCreateChat = 904,
    Other = 905
}

export class DeliveryStatusRequest extends DTO {
    @Prop({ enum: DeliveryStatus, rawPropertyName: 'status_code' })
    deliveryStatus!: DeliveryStatus

    @Prop({ enum: DeliveryErrorCode })
    errorCode!: DeliveryErrorCode

    @Prop()
    error!: string
}
