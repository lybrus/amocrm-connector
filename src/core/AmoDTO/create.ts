import {metadataStore} from '~/metadataStore'
import {AmoDTO} from './AmoDTO'
import {InstanceOrNestedArray, isArray} from '~/tools/types/NestedArray'
import {DeepPartial} from '~/tools/types/DeepPartial'
import {isAmoDTO, isAmoDTOInstance} from './isAmoDTO'
import {AmoLikeExtended} from '~/tools/types/AmoLike'

export const create = <T extends typeof AmoDTO>(targetClass: T, amoLike: AmoLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T> => {
    if (isArray(amoLike)) return amoLike.map(item => create(targetClass, item)) as InstanceOrNestedArray<T>
    if (isAmoDTOInstance(amoLike)) return amoLike

    const propertyDescriptionMap = metadataStore.getPropertyDescriptionMap(targetClass.prototype)
    const result = (new targetClass()) as InstanceType<T>

    for (const [propName, propertyDescriptions] of propertyDescriptionMap) {
        if (!(propName in amoLike)) continue

        const {type} = propertyDescriptions[0]
        const rawValue = amoLike[propName as keyof DeepPartial<InstanceType<T>>]
        result[propName as keyof InstanceType<T>] =
            (isAmoDTO(type) ? create(type, rawValue) : rawValue) as InstanceType<T>[keyof InstanceType<T>]
    }

    return result
}
