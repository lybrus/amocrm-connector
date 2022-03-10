import {JSONObjectOrArray, JSONType} from '~/tools/types/json'
import {metadataStore, PropertyDescription} from '~/metadataStore'
import {AmoDTO} from './AmoDTO'
import {InstanceOrNestedArray, isArray, isNotArray} from '~/tools/types/NestedArray'
import {isAmoDTO} from './isAmoDTO'
import {isAmoEntity} from '~/core/isAmoEntity'

const loadValue = (propertyDescription: PropertyDescription, rawValue: JSONType): any => {
    const {serializer, type} = propertyDescription

    if (isAmoEntity(type) && isNotArray(rawValue)) {
        if (!(typeof rawValue === 'string' || typeof rawValue === 'number'))
            return importFromRawData(type, rawValue as JSONObjectOrArray)
        return new type(rawValue)
    }
    if (isAmoDTO(type) && rawValue) return importFromRawData(type, rawValue as JSONObjectOrArray)
    if (serializer) return serializer.deserialize(rawValue)
    if (rawValue === undefined || rawValue === null) return undefined

    return rawValue
}

export const importFromRawData = <T extends typeof AmoDTO>(targetClass: T, rawData: JSONType): InstanceOrNestedArray<T> => {
    if (typeof rawData !== 'object' || rawData === null)
        throw new Error(`Expected object, but received ${rawData}`)

    if (isArray(rawData)) return rawData.map(item => importFromRawData(targetClass, item)) as InstanceOrNestedArray<T>

    const propertyDescriptionMap = metadataStore.getPropertyDescriptionMap(targetClass.prototype)
    const result = (new targetClass()) as InstanceType<T>

    for (const [propName, propertyDescriptions] of propertyDescriptionMap) {
        const propertyDescription = propertyDescriptions[0]
        const {rawPropertyName} = propertyDescription
        const rawValue = rawData[rawPropertyName]

        result[propName as keyof InstanceType<T>] = loadValue(propertyDescription, rawValue)
    }

    return result
}
