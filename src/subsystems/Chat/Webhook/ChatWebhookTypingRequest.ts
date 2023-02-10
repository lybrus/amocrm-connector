import {AmoDTO} from '~/core'
import {Prop} from '~/decorators'
import {DateSerializerTimestamp} from '~/tools/Serializer'
import {ChatWebhookAction} from './ChatWebhookAction'

export class ChatWebhookTypingRequest extends AmoDTO {
    @Prop()
    accountId!: string

    @Prop({serializer: DateSerializerTimestamp})
    time!: Date

    @Prop()
    action!: ChatWebhookAction
}

// {
//   "account_id": "bd5f93ec-3d31-42b9-ab90-c2ad4e59e48d",
//   "time": 1645730703,
//   "action": {
//     "typing": {
//       "user": {
//         "id": "be8f4107-5407-48cb-8ec0-5ea4f8d50a60"
//       },
//       "conversation": {
//         "id": "9ab66c75-24f5-45a5-9a82-2a5137d26f16",
//         "client_id": "test5"
//       },
//       "expired_at": 1645730707
//     }
//   }
// }
