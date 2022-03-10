import {AmoDTO} from './AmoDTO'

export const isAmoDTO = (object: any): object is typeof AmoDTO => {
    return object.prototype instanceof AmoDTO
}

export const isAmoDTOInstance = (object: any): object is AmoDTO => {
    return object instanceof AmoDTO
}
