import { metadataStore } from '../metadata'
import { DTOWithId } from '../dto-with-id'

export function Id(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        if (typeof propertyKey !== 'string') return
        const entityDescription = metadataStore.getEntityDescription(target as DTOWithId<any>, true)
        entityDescription.idPropertyName = propertyKey
    }
}
