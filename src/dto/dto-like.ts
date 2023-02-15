import { DTO } from './dto'
import { DeepPartial } from './deep-partial'
import { ObjectOrNestedArray } from './nested-array'

export type DTOLikeExtended<T extends DTO = DTO> = ObjectOrNestedArray<DTOLike<T>>
export type DTOLike<T extends DTO = DTO> = T | DeepPartial<T>
