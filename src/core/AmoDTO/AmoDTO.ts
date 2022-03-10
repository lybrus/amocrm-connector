import {JSONObject, JSONObjectOrArray} from '~/tools/types/json'
import {importFromRawData} from './importFromRawData'
import {exportToRawData} from './exportToRawData'
import {create} from './create'
import {DeepPartial} from '~/tools/types/DeepPartial'
import {
    InstanceOrNestedArray,
    NestedArray,
    NestedInstanceArray,
    ObjectOrNestedArray
} from '~/tools/types/NestedArray'
import {AmoLike, AmoLikeExtended} from '~/tools/types/AmoLike'

export class AmoDTO {
    static import<T extends typeof AmoDTO>(this: T, rawData: JSONObject): InstanceType<T>
    static import<T extends typeof AmoDTO>(this: T, rawData: NestedArray<JSONObject>): NestedInstanceArray<T>
    static import<T extends typeof AmoDTO>(this: T, rawData: JSONObjectOrArray): InstanceOrNestedArray<T>
    static import<T extends typeof AmoDTO>(this: T, rawData: JSONObjectOrArray): InstanceOrNestedArray<T> {
        return importFromRawData(this, rawData)
    }

    static create<T extends typeof AmoDTO>(this: T, amoLike: DeepPartial<InstanceType<T>>): InstanceType<T>
    static create<T extends typeof AmoDTO>(this: T, amoLike: NestedArray<DeepPartial<InstanceType<T>>>): NestedInstanceArray<T>
    static create<T extends typeof AmoDTO>(this: T, amoLike: InstanceType<T>): InstanceType<T>
    static create<T extends typeof AmoDTO>(this: T, amoLike: NestedArray<InstanceType<T>>): NestedInstanceArray<T>
    static create<T extends typeof AmoDTO>(this: T, amoLike: AmoLike<InstanceType<T>>): InstanceType<T>
    static create<T extends typeof AmoDTO>(this: T, amoLike: AmoLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T>
    static create<T extends typeof AmoDTO>(this: T, amoLike: AmoLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T> {
        return create(this, amoLike)
    }

    static export<T extends AmoDTO>(object: T): JSONObject
    static export<T extends AmoDTO>(object: NestedArray<T>): NestedArray<JSONObject>
    static export<T extends AmoDTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray
    static export<T extends AmoDTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray {
        return exportToRawData(object)
    }

    getRawData(): JSONObject {
        return exportToRawData(this)
    }
}




