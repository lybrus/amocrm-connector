import { Serializer } from '..'

export interface PropertyOptions {
    rawPropertyName?: string
    serializer?: Serializer
    type?: new () => any
    enum?: any,
    optional?: boolean
}
