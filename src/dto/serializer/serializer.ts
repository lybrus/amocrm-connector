import { JSONType } from '..'

export interface Serializer {
    serialize(value: any): JSONType

    deserialize(value: JSONType): any
}
