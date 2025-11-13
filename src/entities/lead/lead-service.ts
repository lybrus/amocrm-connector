import { BaseEntityService, EntityService } from '~/entity-service'
import { Lead } from './lead-entity'

@EntityService({
    url: '/api/v4/leads',
    entityClass: Lead
})
export class LeadService extends BaseEntityService<Lead> {

}