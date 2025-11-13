import { DTO, Prop } from '~/dto'
import { MessageParticipant, MessageRequestSource } from './message'


export class CreateConversationRequest extends DTO {
    @Prop()
    conversationId!: string

    @Prop({ optional: true })
    source?: MessageRequestSource

    @Prop()
    user!: Omit<MessageParticipant, 'refId'>
}

class CreateConversationResponseUser extends DTO {
    @Prop()
    id!: string

    @Prop()
    clientId?: string

    @Prop()
    name!: string

    @Prop()
    avatar!: string

    @Prop()
    phone?: string

    @Prop()
    email?: string
}

export class CreateConversationResponse extends DTO {
    @Prop()
    id!: string

    @Prop()
    user!: CreateConversationResponseUser
}
