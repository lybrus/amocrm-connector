import { DTOWithId } from '~/dto'
import { EntityParams } from './entity-params'

export class BaseEntity<P extends EntityParams = EntityParams> extends DTOWithId<P['withParams']> {
}

export type EntityCtor = typeof BaseEntity<any>