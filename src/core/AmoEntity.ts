import {metadataStore} from '~/metadataStore'


export type AmoEntityIdType = number | string

const getIdPropertyName = (amoEntity: AmoEntity<any>): string => {
    const entityDescription = metadataStore.getEntityDescription(Object.getPrototypeOf(amoEntity))
    if (!entityDescription) throw new Error('Entity should have id property')
    const {idPropertyName} = entityDescription
    return idPropertyName
}

export class AmoEntity<T extends AmoEntityIdType> {
    constructor(id: T) {
        //super()

        const idPropertyName = getIdPropertyName(this) as keyof this
        // @ts-ignore
        this[idPropertyName] = id
    }

    getId(): T {
        // @ts-ignore
        return this[getIdPropertyName(this)]
    }
}
