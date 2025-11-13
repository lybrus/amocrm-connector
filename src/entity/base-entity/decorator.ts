import { BaseCollection } from '../base-collection'
import { metadataStore } from '~/dto/metadata'

export interface EntityOptions {
    pluralName?: string
    childCollections?: Record<string, typeof BaseCollection>
}

export function Entity(entityOptions: EntityOptions): ClassDecorator {
    return (target: any) => {
        metadataStore.registerEntity(target, entityOptions)
    }
}