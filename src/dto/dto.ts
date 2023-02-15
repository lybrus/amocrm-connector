import { JSONObject, JSONObjectOrArray } from './json'
import { importFromRawData } from './import-from-raw-data'
import { exportToRawData } from './export-to-raw-data'
import { create } from './create'
import { DeepPartial } from './deep-partial'
import {
    InstanceOrNestedArray,
    NestedArray,
    NestedInstanceArray,
    ObjectOrNestedArray
} from './nested-array'
import { DTOLike, DTOLikeExtended } from './dto-like'

export class DTO {
    static import<T extends typeof DTO>(this: T, rawData: JSONObject): InstanceType<T>
    static import<T extends typeof DTO>(this: T, rawData: NestedArray<JSONObject>): NestedInstanceArray<T>
    static import<T extends typeof DTO>(this: T, rawData: JSONObjectOrArray): InstanceOrNestedArray<T>
    static import<T extends typeof DTO>(this: T, rawData: JSONObjectOrArray): InstanceOrNestedArray<T> {
        return importFromRawData(this, rawData)
    }

    static create<T extends typeof DTO>(this: T, amoLike: DeepPartial<InstanceType<T>>): InstanceType<T>
    static create<T extends typeof DTO>(this: T, amoLike: NestedArray<DeepPartial<InstanceType<T>>>): NestedInstanceArray<T>
    static create<T extends typeof DTO>(this: T, amoLike: InstanceType<T>): InstanceType<T>
    static create<T extends typeof DTO>(this: T, amoLike: NestedArray<InstanceType<T>>): NestedInstanceArray<T>
    static create<T extends typeof DTO>(this: T, amoLike: DTOLike<InstanceType<T>>): InstanceType<T>
    static create<T extends typeof DTO>(this: T, amoLike: DTOLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T>
    static create<T extends typeof DTO>(this: T, amoLike: DTOLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T> {
        return create(this, amoLike)
    }

    static export<T extends DTO>(object: T): JSONObject
    static export<T extends DTO>(object: NestedArray<T>): NestedArray<JSONObject>
    static export<T extends DTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray
    static export<T extends DTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray {
        return exportToRawData(object)
    }

    getRawData(): JSONObject {
        return exportToRawData(this)
    }
}




