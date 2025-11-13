import { HALEntity } from './hal-entity'
import { HALLinks } from './hal-links'

export type HALCollection = {
    _page: number,
    _links: HALLinks,
    _embedded: {
        [K: string]: HALEntity[]
    }
}

export const isHALCollection = (value: any): value is HALCollection => {
    return (value as HALCollection)._embedded !== undefined
}