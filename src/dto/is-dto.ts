import { DTO } from './dto'

export const isDTO = (object: any): object is typeof DTO => {
    return object.prototype instanceof DTO
}

export const isDTOInstance = (object: any): object is DTO => {
    return object instanceof DTO
}
