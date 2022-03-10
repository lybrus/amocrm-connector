import {metadataStore} from '~/metadataStore'
import {AmoEntity} from '~/core'

export function Id(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        if (typeof propertyKey !== 'string') return
        const entityDescription = metadataStore.getEntityDescription(target as AmoEntity<any>, true)
        entityDescription.idPropertyName = propertyKey
    }
}
