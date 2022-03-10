import {AmoEntity} from './AmoEntity'

export const isAmoEntity = (object: any): object is typeof AmoEntity => {
    return object.prototype instanceof AmoEntity
}

export const isAmoEntityInstance = (object: any): object is AmoEntity<any> => {
    return object instanceof AmoEntity
}
