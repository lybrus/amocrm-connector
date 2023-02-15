import { PropertyOptions } from './property-options'
import { metadataStore, PropertyDescription } from '../metadata'
import { camelCaseToSnakeCase } from './camel-case-to-snake-case'

type PreliminaryPropertyDescription =
    Pick<PropertyDescription, 'serializer' | 'optional' | 'enum'>
    & Partial<PropertyDescription>

const getPartialPropertyDescription = (rawPropertyNameOrOptions?: string | PropertyOptions): PreliminaryPropertyDescription => {
    const rawPropertyName = typeof rawPropertyNameOrOptions === 'object' ? rawPropertyNameOrOptions.rawPropertyName : rawPropertyNameOrOptions
    const options = typeof rawPropertyNameOrOptions === 'object' ? rawPropertyNameOrOptions : undefined
    const { type, enum: enumValue, optional = false, serializer } = options || {}

    return {
        rawPropertyName,
        type,
        serializer,
        optional,
        enum: enumValue
    }
}

const getPropertyDescription = (
    target: Object,
    propertyKey: string,
    preliminaryDescription: PreliminaryPropertyDescription
): PropertyDescription => {
    const {
        rawPropertyName,
        type,
        serializer,
        optional,
        enum: enumValue
    } = preliminaryDescription

    const reflectType = Reflect.getMetadata('design:type', target, propertyKey)
    const description = {
        rawPropertyName: rawPropertyName || camelCaseToSnakeCase(propertyKey),
        serializer: serializer,
        type: type || reflectType,
        isArray: reflectType === Array,
        enum: enumValue,
        optional
    }

    return description
}

export function Prop(): PropertyDecorator
export function Prop(rawPropertyName: string): PropertyDecorator
export function Prop(options: PropertyOptions): PropertyDecorator
export function Prop(options: PropertyOptions[]): PropertyDecorator

export function Prop(rawPropertyNameOrOptions?: string | PropertyOptions | PropertyOptions[]): PropertyDecorator {
    const preliminaryDescriptions = rawPropertyNameOrOptions instanceof Array
        ? rawPropertyNameOrOptions.map(item => getPartialPropertyDescription(item))
        : [getPartialPropertyDescription(rawPropertyNameOrOptions)]

    return (target: Object, propertyKey: string | symbol) => {
        if (typeof propertyKey !== 'string') return
        const dtoDescriptionMap = metadataStore.getPropertyDescriptionMap(target, true)
        const description = preliminaryDescriptions.map(item => getPropertyDescription(target, propertyKey, item))

        dtoDescriptionMap.set(propertyKey, description)
    }
}
