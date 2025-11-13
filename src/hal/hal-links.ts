import { HALLink } from './hal-link'

export type HALLinks = {
    self: HALLink,
    next?: HALLink,
    first?: HALLink,
    prev?: HALLink
}