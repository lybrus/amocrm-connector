import {Prop} from '~/decorators'
import {AmoDTO} from '~/core'

export class AddMessageParticipantProfile extends AmoDTO {
    @Prop({optional: true})
    phone?: string

    @Prop({optional: true})
    email?: string
}

export class MessageParticipant extends AmoDTO {
    @Prop()
    id: string

    @Prop({optional: true})
    refId?: string

    @Prop()
    name: string

    @Prop({optional: true})
    avatar?: string

    @Prop({optional: true})
    profile?: AddMessageParticipantProfile

    @Prop({optional: true})
    profileLink?: string
}


