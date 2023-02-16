import { metadataStore } from './metadata'
import { DTO } from './dto'

export type DTOIdType = number | string

const getIdPropertyName = (amoEntity: DTOWithId<any>): string => {
    const entityDescription = metadataStore.getEntityDescription(Object.getPrototypeOf(amoEntity))
    if (!entityDescription) throw new Error('Entity should have id property')
    const { idPropertyName } = entityDescription
    return idPropertyName
}

export const isDTOWithIdClass = (object: any): object is typeof DTOWithId => {
    return object.prototype instanceof DTOWithId
}

export const isDTOWithId = (object: any): object is DTOWithId<any> => {
    return object instanceof DTOWithId
}

export class DTOWithId<T extends DTOIdType = ''> extends DTO {
    constructor(id?: T) {
        super()

        if (id) {
            const idPropertyName = getIdPropertyName(this) as keyof this
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this[idPropertyName] = id
        }
    }

    getId(): T {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this[getIdPropertyName(this)]
    }
}
