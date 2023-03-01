import { Chat, ChatDescription } from './chat'
import { ChatWebhookMessageRequest, ChatWebhookTypingRequest } from './webhook'

export type MessageFilter = {
    chat?: Chat | ChatDescription
}

export interface ChatEvents {
    'message': {
        cb: (chat: Chat, messageRequest: ChatWebhookMessageRequest) => void,
        filter: MessageFilter
    };

    'typing': {
        cb: (chat: Chat, typingRequest: ChatWebhookTypingRequest) => void,
        filter: undefined
    }
}

export const filtersCheck: {
    [event in keyof ChatEvents]: (args: Parameters<ChatEvents[event]['cb']>, filter: ChatEvents[event]['filter']) => boolean
} = {
    message: ([chat], filter) => {
        if (!filter) return true
        let result = true
        const { chat: chatDescription } = filter
        if (chatDescription) {
            const { scopeId } = chatDescription
            result &&= (scopeId === chat.scopeId)
        }
        return result
    },
    typing: () => true
}

export type Subscribers = {
    [event in keyof ChatEvents]?: Map<ChatEvents[event]['cb'], ChatEvents[event]['filter']>
}
