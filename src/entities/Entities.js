import EventEmitter from 'events'
import queryString from 'querystring'
import EntityPack from './EntityPack'
import Entity from './Entity'

class Entities extends EventEmitter {
    constructor({
        amocrm,
        schema
    }) {
        super()

        this.amocrm = amocrm
        this._setSchema(schema)
        // this.updateCustomFields(customFields)
    }

    _setSchema(schema) {
        this.schema = schema
    }

    updateCustomFields(customFields = []) {
        this.customFields = customFields
    }

    create() {

    }

    async getList({
        limit = 250,
        page = 1,
        query,
        order
    } = {}) {
        const {
            paths: { base } = {},
            name
        } = this.schema

        if (!base) return

        const response = await this.amocrm.request({
            path: `${base}?${queryString.stringify({
                limit,
                page,
                query,
                order
            })}`
        })
        const { data, statusCode } = response

        if (statusCode === 204) return new EntityPack([])

        const { _embedded } = data
        const list = _embedded[name]

        return new EntityPack(list.map(entityData => new Entity(this, entityData)))
    }
}

export default Entities
