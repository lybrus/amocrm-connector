import {JSONObject, JSONObjectOrArray, JSONType} from '~/tools/types/json'
import {metadataStore, PropertyDescription} from '~/metadataStore'
import {AmoDTO} from './AmoDTO'
import {isArray, ObjectOrNestedArray} from '~/tools/types/NestedArray'
import {isAmoDTO, isAmoDTOInstance} from './isAmoDTO'
import {isAmoEntityInstance} from '~/core/isAmoEntity'

const saveValue = (value: unknown, propertyDescription: PropertyDescription): JSONType => {
    const {serializer, type} = propertyDescription

    if (isAmoEntityInstance(type) && isAmoEntityInstance(value)) return value.getId()
    if (isAmoDTO(type) && isAmoDTOInstance(value)) return exportToRawData(value)
    if (serializer) return serializer.serialize(value)
    if (value === undefined) return null
    return value as JSONType
}

export function exportToRawData<T extends AmoDTO>(object: T): JSONObject
export function exportToRawData<T extends AmoDTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray
export function exportToRawData<T extends AmoDTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray {
    if (isArray(object)) return object.map(item => exportToRawData(item))
    if (!isAmoDTOInstance(object))
        throw new Error(`Expected AmoDTO object, but received ${object}`)

    const rawData: { [key: string]: JSONType } = {}
    const propertyDescriptionMap = metadataStore.getPropertyDescriptionMap(Object.getPrototypeOf(object))
    for (const [propName, propertyDescriptions] of propertyDescriptionMap) {
        for (const propertyDescription of propertyDescriptions) {
            const {rawPropertyName, optional} = propertyDescription
            const propNameTyped = propName as keyof object
            if ((object[propNameTyped] === undefined || object[propNameTyped] === null) && optional) continue
            rawData[rawPropertyName] = saveValue(object[propNameTyped], propertyDescription)
        }
    }

    return rawData
}
