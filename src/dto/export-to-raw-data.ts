import { JSONObject, JSONObjectOrArray, JSONType } from './json'
import { metadataStore, PropertyDescription } from './metadata'
import { DTO } from './dto'
import { isArray, ObjectOrNestedArray } from './nested-array'
import { isDTO, isDTOInstance } from './is-dto'
import { isDTOWithId } from './dto-with-id'

const saveValue = (value: unknown, propertyDescription: PropertyDescription): JSONType => {
    const { serializer, type } = propertyDescription

    if (isDTOWithId(type) && isDTOWithId(value)) return value.getId()
    if (isDTO(type) && isDTOInstance(value)) return exportToRawData(value)
    if (serializer) return serializer.serialize(value)
    if (value === undefined) return null
    return value as JSONType
}

export function exportToRawData<T extends DTO>(object: T): JSONObject
export function exportToRawData<T extends DTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray
export function exportToRawData<T extends DTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray {
    if (isArray(object)) return object.map(item => exportToRawData(item))
    if (!isDTOInstance(object))
        throw new Error(`Expected DTO object, but received ${object}`)

    const rawData: { [key: string]: JSONType } = {}
    const propertyDescriptionMap = metadataStore.getPropertyDescriptionMap(Object.getPrototypeOf(object))
    for (const [propName, propertyDescriptions] of propertyDescriptionMap) {
        for (const propertyDescription of propertyDescriptions) {
            const { rawPropertyName, optional } = propertyDescription
            const propNameTyped = propName as keyof object
            if ((object[propNameTyped] === undefined || object[propNameTyped] === null) && optional) continue
            rawData[rawPropertyName] = saveValue(object[propNameTyped], propertyDescription)
        }
    }

    return rawData
}
