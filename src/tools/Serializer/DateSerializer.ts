import {Serializer} from './Serializer'
import {JSONType} from '~/tools/types/json'

export class DateSerializer extends Serializer {
    constructor(private readonly standard: 'timestamp' | 'unixtime') {
        super()
    }

    serialize(value: Date): JSONType {
        switch(this.standard) {
            case 'timestamp':
                return Math.round(+value/1000)
            case 'unixtime':
                return +value
        }
        return null
    }

    deserialize(value: string | number): any {
        switch(this.standard) {
            case 'timestamp':
                if (typeof value === 'string') throw new Error('Timestamp should be a number')
                return new Date(value * 1000)
            case 'unixtime':
                if (typeof value === 'string') throw new Error('Timestamp should be a number')
                return new Date(value)
        }
        return null
    }
}

export const DateSerializerTimestamp = new DateSerializer('timestamp')
export const DateSerializerUnixTime = new DateSerializer('unixtime')
