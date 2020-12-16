import Entities from '~/entities/Entities'
import Joi from '~/joi'
import { schema as tagSchema } from './Tags'
import { schema as lossReasonSchema } from './LossReasons'

const withKeys = {
    catalogElements: 'catalog_elements',
    isPriceModifiedByRobot: 'is_price_modified_by_robot',
    lossReason: 'loss_reason',
    contacts: 'contacts',
    onlyDeleted: 'only_deleted',
    source: 'source_id'
}

const schema = {
    name: 'leads',
    paths: {
        base: '/api/v4/leads',
        customFields: '/api/v4/leads/custom_fields'
    },
    withKeys,
    fields: {
        id: Joi.number().integer().positive(),
        name: Joi.string(),
        price: Joi.number().positive(),
        responsibleUser: {
            type: Joi.number().integer().positive(),
            ref: 'responsible_user_id',
            link: 'users'
        },
        userGroup: {
            type: Joi.number().integer().positive(),
            ref: 'group_id',
            link: 'userGroups'
        },
        status: {
            type: Joi.number().integer().positive(),
            ref: 'status_id',
            link: {
                owner: 'pipeline',
                name: 'statuses'
            }
        },
        pipeline: {
            type: Joi.number().integer().positive(),
            ref: 'pipeline_id',
            link: 'pipelines'
        },
        lossReason: {
            type: Joi.number().integer().positive().allow(null),
            ref: 'loss_reason_id',
            link: 'lossReasons'
        },
        source: { // TODO What entity is it?
            type: Joi.number().integer().positive().allow(null),
            ref: 'source_id',
            withKey: withKeys.source
        },
        createdBy: {
            type: Joi.number().integer().positive(),
            ref: 'created_by',
            link: 'users'
        },
        updatedBy: {
            type: Joi.number().integer().positive(),
            ref: 'updated_by',
            link: 'users'
        },
        closedAt: {
            type: Joi.date().timestamp('unix').allow(null),
            ref: 'closed_at'
        },
        createdAt: {
            type: Joi.date().timestamp('unix'),
            ref: 'created_at'
        },
        updatedAt: {
            type: Joi.date().timestamp('unix'),
            ref: 'updated_at'
        },
        closestTaskAt: {
            type: Joi.date().timestamp('unix').allow(null),
            ref: 'closest_task_at'
        },
        isDeleted: {
            type: Joi.boolean(),
            ref: 'is_deleted'
        },
        score: Joi.number().integer().allow(null),
        account: {
            type: Joi.number().integer().positive(),
            ref: 'account_id'
        },
        isPriceModifiedByRobot: {
            type: Joi.boolean(),
            ref: 'is_price_modified_by_robot',
            withKey: withKeys.isPriceModifiedByRobot
        }
    },
    children: {
        lossReason: {
            schema: lossReasonSchema,
            collection: false,
            withKey: withKeys.lossReason,
            ref: 'loss_reason'
        },
        tags: {
            schema: tagSchema
        }
    },
    links: {
        contacts: {
            link: 'contacts',
            withKey: withKeys.contacts
        },
        companies: {
            link: 'companies'
        },
        catalogElements: {
            link: 'catalogsElements',
            withKey: withKeys.catalogElements,
            ref: 'catalog_elements'
        }
    }
}

export class Leads extends Entities {
    constructor(amocrm) {
        super({
            amocrm,
            schema
        })
    }
}

export default Leads
