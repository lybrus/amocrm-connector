import { DTOIdType } from '~/dto'
import { BaseEntity } from './base-entity'

export interface EntityParams {
    id: DTOIdType
    withParams: string
}

export type EntityParamsType<T extends BaseEntity> = T extends BaseEntity<infer F> ? F : never
export type EntityWithParamsType<T extends BaseEntity> = EntityParamsType<T>['withParams']
export type EntityIdType<T extends BaseEntity> = EntityParamsType<T>['id']
