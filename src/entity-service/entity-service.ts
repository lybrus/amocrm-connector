import { Service } from '~/service'
import { BaseCollection, BaseEntity, EntityCtor } from '~/entity'
import { Client } from '~/integration'
import { metadataStore } from '~/dto/metadata'
import { GetParam } from './get-params'
import { HALCollection } from '~/hal'


export class BaseEntityService<T extends BaseEntity> extends Service {
    constructor(client: Client) {
        super(client)
    }

    async getPage(params: GetParam<T> | string = {}): Promise<BaseCollection<T>> {
        const { client } = this
        const entityServiceDescription = metadataStore.getEntityServiceDescription(this.constructor)
        let { url } = entityServiceDescription
        const { entityClass } = entityServiceDescription
        const { collectionClass } = metadataStore.getEntityDescription(entityClass)
        if (!collectionClass) throw new Error(`Collection for entity ${entityClass.name} is not registered`)

        let requestParams = undefined
        if (typeof params === 'string') {
            url = params
        } else if (params !== undefined) {
            const { withParams = [], page = 0, limit = 50 } = params
            requestParams = {
                with: withParams.join(','),
                page,
                limit
            }
        }

        const { data } = await client.get<HALCollection>({
            url,
            params: requestParams
        })

        return new collectionClass(data || [])
    }

    async* paginate(params: GetParam<T> | string = {}): AsyncIterable<BaseCollection<T>> {
        let cursor: BaseCollection<T> | undefined = undefined
        let linkOrParams: GetParam<T> | string | undefined = params
        while (linkOrParams) {
            cursor = await this.getPage(linkOrParams)
            yield cursor
            linkOrParams = cursor.getNextLink()
        }
    }

    async* iterateAll(params: GetParam<T> | string = {}): AsyncIterable<T> {
        for await (const page of this.paginate(params)) {
            for (const item of page) yield item
        }
    }
}

export interface EntityServiceOptions {
    entityClass: EntityCtor
    url: string
}

export function EntityService(entityServiceOptions: EntityServiceOptions): ClassDecorator {
    return (target: any) => {
        metadataStore.registerEntityService(target, entityServiceOptions)
    }
}