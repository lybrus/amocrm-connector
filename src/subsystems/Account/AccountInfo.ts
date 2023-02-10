import {Prop, Id} from '~/decorators'
import {DateSerializerTimestamp} from '~/tools/Serializer'
import {AmoDTO, AmoEntity} from '~/core'

export class User extends AmoEntity<number> {
    @Id()
    @Prop()
    id!: number
}

enum CustomerMode {
    Unavailable = 'unavailable',
    Disabled = 'disabled',
    Segments = 'segments',
    Dynamic = 'dynamic',
    Periodicity = 'periodicity'
}

enum ContactNameDisplayOrder {
    NameSurname = 1,
    SurnameName = 2
}

export class AccountInfo extends AmoDTO {
    @Prop()
    id!: number

    @Prop()
    name!: string

    @Prop()
    subdomain!: string

    @Prop({serializer: DateSerializerTimestamp})
    createdAt!: Date

    @Prop()
    createdBy!: User

    @Prop({serializer: DateSerializerTimestamp})
    updatedAt!: Date

    @Prop()
    updatedBy!: User

    @Prop('current_user_id')
    currentUser!: User

    @Prop()
    country!: string

    @Prop()
    currency!: string

    @Prop()
    currencySymbol!: string

    @Prop({enum: CustomerMode, optional: true})
    customerMode?: CustomerMode

    @Prop()
    isUnsortedOn!: boolean

    @Prop()
    mobileFeatureVersion!: number

    @Prop()
    isLossReasonEnabled!: boolean

    @Prop('is_helpbot_enabled')
    isHelpBotEnabled!: boolean

    @Prop()
    isTechnicalAccount!: boolean

    @Prop()
    contactNameDisplayOrder!: ContactNameDisplayOrder

    @Prop({optional: true})
    amojoId?: string

    @Prop({optional: true})
    version?: number
}

