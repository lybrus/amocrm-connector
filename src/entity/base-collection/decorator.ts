import { EntityCtor } from '../base-entity'
import { metadataStore } from '~/dto/metadata'

export interface CollectionOptions<T extends EntityCtor> {
    entityClass: T
}

export function Collection<T extends EntityCtor>(collectionOptions: CollectionOptions<T>): ClassDecorator {
    return (target: any) => {
        metadataStore.registerCollection(target, collectionOptions)
    }
}