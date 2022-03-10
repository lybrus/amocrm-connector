export type NestedArray<T> = T[] | NestedArray<T>[]
export type NestedInstanceArray<T extends new() => any> = NestedArray<InstanceType<T>>
export type ObjectOrNestedArray<T> = T | NestedArray<T>
export type InstanceOrNestedArray<T extends new() => any> = ObjectOrNestedArray<InstanceType<T>>

export function isArray<T>(object: ObjectOrNestedArray<T>): object is NestedArray<T> {
    return object instanceof Array
}
export function isNotArray<T>(object: ObjectOrNestedArray<T>): object is T {
    return !isArray(object)
}
