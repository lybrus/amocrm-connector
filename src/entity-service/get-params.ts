import { BaseEntity, EntityWithParamsType } from '~/entity'

export type GetParam<T extends BaseEntity> = {
    withParams?: EntityWithParamsType<T>[],
    page?: number,
    limit?: number
}
