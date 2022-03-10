import {Serializer} from '~/tools/Serializer'

export interface PropertyOptions {
    rawPropertyName?: string
    serializer?: Serializer
    type?: Function
    enum?: Object,
    optional?: boolean
}
