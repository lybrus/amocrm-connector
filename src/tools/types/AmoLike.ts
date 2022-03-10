import {AmoDTO} from '~/core'
import {DeepPartial} from './DeepPartial'
import {ObjectOrNestedArray} from '~/tools/types/NestedArray'

export type AmoLikeExtended<T extends AmoDTO = AmoDTO> = ObjectOrNestedArray<AmoLike<T>>
export type AmoLike<T extends AmoDTO = AmoDTO> = T | DeepPartial<T>
