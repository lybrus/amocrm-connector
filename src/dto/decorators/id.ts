import { metadataStore } from '../metadata'

export function Id(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        if (typeof propertyKey !== 'string') return
        const entityDescription = metadataStore.getEntityDescription(target, true)
        entityDescription.idPropertyName = propertyKey
    }
}
