import { JSONObjectOrArray, JSONType } from './json'
import { metadataStore, PropertyDescription } from './metadata'
import { DTO } from './dto'
import { InstanceOrNestedArray, isArray } from './nested-array'
import { isDTO } from './is-dto'
import { isDTOWithIdClass } from './dto-with-id'

const loadValue = (propertyDescription: PropertyDescription, rawValue: JSONType): any => {
    const { serializer, type } = propertyDescription

    if (isDTOWithIdClass(type) && (typeof rawValue === 'string' || typeof rawValue === 'number')) return new type(rawValue)
    if (isDTO(type) && rawValue) return importFromRawData(type, rawValue as JSONObjectOrArray)
    if (serializer) return serializer.deserialize(rawValue)
    if (rawValue === undefined || rawValue === null) return undefined

    return rawValue
}

export const importFromRawData = <T extends typeof DTO>(targetClass: T, rawData: JSONType): InstanceOrNestedArray<T> => {
    if (typeof rawData !== 'object' || rawData === null)
        throw new Error(`Expected object, but received ${rawData}`)

    if (isArray(rawData)) return rawData.map(item => importFromRawData(targetClass, item)) as InstanceOrNestedArray<T>

    const propertyDescriptionMap = metadataStore.getPropertyDescriptionMap(targetClass.prototype)
    const result = (new targetClass()) as InstanceType<T>

    for (const [propName, propertyDescriptions] of propertyDescriptionMap) {
        const propertyDescription = propertyDescriptions[0]
        const rawPropertyName = propertyDescription?.rawPropertyName
        if (!rawPropertyName) continue

        const rawValue = rawData[rawPropertyName]
        if (!rawValue) continue

        result[propName as keyof InstanceType<T>] = loadValue(propertyDescription, rawValue)
    }

    return result
}
