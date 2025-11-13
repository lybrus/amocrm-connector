import { HALLinks } from './hal-links'
import { BaseCollection } from '~/entity'
import { JSONObject } from '~/dto'

export type HALEntity =
    {
        _links: HALLinks,
        _embedded: {
            [K: string]: BaseCollection<any>
        }
    }
    & JSONObject

export const isHALEntity = (value: any): value is HALEntity => {
    return (value as HALEntity)._embedded !== undefined
}
