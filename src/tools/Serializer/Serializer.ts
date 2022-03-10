import {JSONType} from '~/tools/types/json'

export class Serializer {
    serialize(value: any): JSONType {
        return JSON.stringify(value)
    }

    deserialize(_value: JSONType): any {
        return null
    }
}
