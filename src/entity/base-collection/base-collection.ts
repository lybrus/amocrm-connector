import { BaseEntity } from '../base-entity'
import { HALCollection, HALEntity, HALLinks, isHALCollection } from '~/hal'
import { DTOLike } from '~/dto'
import { metadataStore } from '~/dto/metadata'

export class BaseCollection<T extends BaseEntity> implements Iterable<T> {
    private halMeta?: { page: number, links: HALLinks } = undefined
    private entities: T[] = []

    constructor(list: DTOLike<T>[] | HALCollection = []) {
        const { entityClass } = metadataStore.getCollectionDescription(this.constructor)
        const { pluralName } = metadataStore.getEntityDescription(entityClass)

        if (!pluralName) throw new Error(`Plural name for entity ${entityClass.name} is not specified`)

        if (isHALCollection(list)) {
            const { _embedded: embedded, _page: page, _links: links } = list
            this.entities = (embedded[pluralName] as HALEntity[])
                .map(rawEntity => entityClass.import(rawEntity)) as T[]

            this.halMeta = {
                page,
                links
            }
            return
        }

        this.entities = list.map(rawEntity => entityClass.create(rawEntity)) as T[]
    }

    getNextLink() {
        return this.halMeta?.links.next?.href
    }

    * [Symbol.iterator]() {
        const { entities } = this
        for (const entity of entities) {
            yield entity
        }
    }
}