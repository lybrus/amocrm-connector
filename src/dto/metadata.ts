import { Serializer } from './serializer'

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
    idPropertyName: string
}

class Index {
    objects = new Map<any, PropertyDescriptionMap>()
    entities = new Map<any, EntityDescription>()

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

    getEntityDescription(target: any, create: true): EntityDescription
    getEntityDescription(target: any, create?: boolean): EntityDescription | undefined
    getEntityDescription(target: any, create = false): EntityDescription | undefined {
        const { entities } = this
        let entityDescription = entities.get(target)

        if (!entityDescription && create) {
            entityDescription = { idPropertyName: '' }
            entities.set(target, entityDescription)
        }

        return entityDescription
    }
}

export const metadataStore = new Index()

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.metadataStore = metadataStore

