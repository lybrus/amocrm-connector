import { Serializer } from './serializer'
import { BaseCollection, CollectionOptions, EntityCtor, EntityOptions } from '~/entity'
import { EntityServiceOptions } from '~/entity-service'

type HasLoadFromDTOProperty = {
    loadFromDTO: boolean
    new: () => any
}

export type PropertyDescription = {
    rawPropertyName: string,
    serializer?: Serializer,
    type: (() => any) | (new () => any) | HasLoadFromDTOProperty,
    isArray: boolean,
    enum?: any,
    optional: boolean
}
export type PropertyDescriptionMap = Map<string, PropertyDescription[]>

export type EntityDescription = {
    idPropertyName?: string
    collectionClass?: typeof BaseCollection
} & EntityOptions

export type CollectionDescription<T extends EntityCtor> = {} & CollectionOptions<T>

export type EntityServiceDescription = {} & EntityServiceOptions

class Index {
    objects = new Map<any, PropertyDescriptionMap>()
    entities = new Map<any, EntityDescription>()
    collections = new Map<any, CollectionDescription<any>>()
    entityServices = new Map<any, EntityServiceDescription>

    getPropertyDescriptionMap(target: any, create: true): PropertyDescriptionMap
    getPropertyDescriptionMap(target: any, create?: boolean): PropertyDescriptionMap
    getPropertyDescriptionMap(target: any, create = false): PropertyDescriptionMap {
        const { objects } = this
        const propertyDescriptionMap = objects.get(target)

        if (propertyDescriptionMap) return propertyDescriptionMap
        if (!create) throw new Error(`property description for ${Object} map not found`)

        const newPropertyDescriptionMap = new Map<string, PropertyDescription[]>()
        objects.set(target, newPropertyDescriptionMap)
        return newPropertyDescriptionMap
    }

    registerEntity(target: any, entityOptions: EntityOptions) {
        const { entities } = this
        if (entities.get(target)) throw new Error(`Entity ${target.name} already registered`)
        entities.set(target, entityOptions)
    }

    getEntityDescription(target: any, create = false): EntityDescription {
        const { entities } = this
        const entityDescription = entities.get(target)
        if (!entityDescription) {
            if (create) {
                const newEntityDescription: EntityDescription = {}
                entities.set(target, newEntityDescription)
                return newEntityDescription
            } else throw new Error(`Entity ${target.name} must be registered with decorator Entity`)
        }
        return entityDescription
    }

    registerCollection<T extends EntityCtor>(target: any, collectionOptions: CollectionOptions<T>) {
        const { collections } = this
        if (collections.get(target)) throw new Error(`Collection ${target.name} already registered`)
        collections.set(target, collectionOptions)

        const { entityClass } = collectionOptions
        const entityDescription = this.getEntityDescription(entityClass, true)
        entityDescription.collectionClass = target
    }

    getCollectionDescription<T extends EntityCtor>(target: any): CollectionDescription<T> {
        const { collections } = this
        const collectionDescription = collections.get(target)
        if (!collectionDescription) throw new Error(`Collection ${target.name} must be registered with decorator Collection`)
        return collectionDescription
    }

    registerEntityService(target: any, entityServiceOptions: EntityServiceOptions) {
        const { entityServices } = this
        if (entityServices.get(target)) throw new Error(`Entity service ${target.name} already registered`)
        entityServices.set(target, entityServiceOptions)
    }

    getEntityServiceDescription(target: any): EntityServiceDescription {
        const { entityServices } = this
        const entityServiceDescription = entityServices.get(target)
        if (!entityServiceDescription) throw new Error(`Entity service ${target.name} must be registered with decorator EntityService`)
        return entityServiceDescription
    }
}

export const metadataStore = new Index()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.metadataStore = metadataStore

