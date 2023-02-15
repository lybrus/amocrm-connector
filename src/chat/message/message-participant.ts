import { Prop, DTO } from '~/dto'

export class AddMessageParticipantProfile extends DTO {
    @Prop({ optional: true })
    phone?: string

    @Prop({ optional: true })
    email?: string
}

export class MessageParticipant extends DTO {
    @Prop()
    id!: string

    @Prop({ optional: true })
    refId?: string

    @Prop()
    name!: string

    @Prop({ optional: true })
    avatar?: string

    @Prop({ optional: true })
    profile?: AddMessageParticipantProfile

    @Prop({ optional: true })
    profileLink?: string
}


