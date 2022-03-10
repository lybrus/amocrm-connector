import {Serializer} from '~/tools/Serializer'

export type PropertyDescription = {
    rawPropertyName: string,
    serializer?: Serializer,
    type: Function | (new () => Object),
    isArray: boolean,
    enum?: Object,
    optional: boolean
}
export type PropertyDescriptionMap = Map<string, PropertyDescription[]>

export type EntityDescription = {
    idPropertyName: string
}

class Index {
    objects = new Map<Object, PropertyDescriptionMap>()
    entities = new Map<Object, EntityDescription>()

    getPropertyDescriptionMap(target: Object, create: true): PropertyDescriptionMap
    getPropertyDescriptionMap(target: Object, create?: boolean): PropertyDescriptionMap
    getPropertyDescriptionMap(target: Object, create: boolean = false): PropertyDescriptionMap {
        const {objects} = this
        const propertyDescriptionMap = objects.get(target)

        if (propertyDescriptionMap) return propertyDescriptionMap
        if (!create) throw new Error(`property description for ${Object} map not found`)

        const newPropertyDescriptionMap = new Map<string, PropertyDescription[]>()
        objects.set(target, newPropertyDescriptionMap)
        return newPropertyDescriptionMap
    }

    getEntityDescription(target: Object, create: true): EntityDescription
    getEntityDescription(target: Object, create?: boolean): EntityDescription | undefined
    getEntityDescription(target: Object, create: boolean = false): EntityDescription | undefined {
        const {entities} = this
        let entityDescription = entities.get(target)

        if (!entityDescription && create) {
            entityDescription = {idPropertyName: ''}
            entities.set(target, entityDescription)
        }

        return entityDescription
    }
}

export const metadataStore = new Index()
// @ts-ignore
global.metadataStore = metadataStore
