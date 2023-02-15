import { metadataStore } from './metadata'
import { DTO } from './dto'
import { InstanceOrNestedArray, isArray } from './nested-array'
import { DeepPartial } from './deep-partial'
import { isDTO, isDTOInstance } from './is-dto'
import { DTOLikeExtended } from './dto-like'

export const create = <T extends typeof DTO>(targetClass: T, dtoLike: DTOLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T> => {
    if (isArray(dtoLike)) return dtoLike.map(item => create(targetClass, item)) as InstanceOrNestedArray<T>
    if (isDTOInstance(dtoLike)) return dtoLike

    const propertyDescriptionMap = metadataStore.getPropertyDescriptionMap(targetClass.prototype)
    const result = (new targetClass()) as InstanceType<T>

    for (const [propName, propertyDescriptions] of propertyDescriptionMap) {
        if (!(propName in dtoLike)) continue

        const type = propertyDescriptions[0]?.type
        const rawValue = dtoLike[propName as keyof DeepPartial<InstanceType<T>>]
        result[propName as keyof InstanceType<T>] =
            (isDTO(type) ? create(type, rawValue) : rawValue) as InstanceType<T>[keyof InstanceType<T>]
    }

    return result
}
