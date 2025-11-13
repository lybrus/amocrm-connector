import { BaseCollection, Collection } from '~/entity'
import { Lead } from './lead-entity'

@Collection({
    entityClass: Lead
})
export class Leads extends BaseCollection<Lead> {

}
