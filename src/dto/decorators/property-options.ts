import { Serializer } from '..'

export interface PropertyOptions {
    rawPropertyName?: string
    serializer?: Serializer
    type?: new () => any
    enum?: Object,
    optional?: boolean
}
