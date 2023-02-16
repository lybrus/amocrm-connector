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

    static create<T extends typeof DTO>(this: T, dtoLike: DeepPartial<InstanceType<T>>): InstanceType<T>
    static create<T extends typeof DTO>(this: T, dtoLike: NestedArray<DeepPartial<InstanceType<T>>>): NestedInstanceArray<T>
    static create<T extends typeof DTO>(this: T, dtoLike: InstanceType<T>): InstanceType<T>
    static create<T extends typeof DTO>(this: T, dtoLike: NestedArray<InstanceType<T>>): NestedInstanceArray<T>
    static create<T extends typeof DTO>(this: T, dtoLike: DTOLike<InstanceType<T>>): InstanceType<T>
    static create<T extends typeof DTO>(this: T, dtoLike: DTOLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T>
    static create<T extends typeof DTO>(this: T, dtoLike: DTOLikeExtended<InstanceType<T>>): InstanceOrNestedArray<T> {
        return create(this, dtoLike)
    }

    static export<T extends DTO>(object: T): JSONObject
    static export<T extends DTO>(object: NestedArray<T>): NestedArray<JSONObject>
    static export<T extends DTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray
    static export<T extends DTO>(object: ObjectOrNestedArray<T>): JSONObjectOrArray {
        return exportToRawData(object)
    }

    static process<T extends typeof DTO>(this: T, dtoLike: DeepPartial<InstanceType<T>>): JSONObject
    static process<T extends typeof DTO>(this: T, dtoLike: NestedArray<DeepPartial<InstanceType<T>>>): NestedArray<JSONObject>
    static process<T extends typeof DTO>(this: T, dtoLike: InstanceType<T>): JSONObject
    static process<T extends typeof DTO>(this: T, dtoLike: NestedArray<InstanceType<T>>): NestedArray<JSONObject>
    static process<T extends typeof DTO>(this: T, dtoLike: DTOLike<InstanceType<T>>): JSONObject
    static process<T extends typeof DTO>(this: T, dtoLike: DTOLikeExtended<InstanceType<T>>): JSONObjectOrArray
    static process<T extends typeof DTO>(this: T, dtoLike: DTOLikeExtended<InstanceType<T>>): JSONObjectOrArray
    {
        const data = this.create(dtoLike)
        return this.export(data)
    }

    getRawData(): JSONObject {
        return exportToRawData(this)
    }
}




