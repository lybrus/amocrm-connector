import EventEmitter from 'events'

class EntityPack extends EventEmitter {
    constructor(entities = []) {
        super()

        this.entities = entities
    }

    add(entity) {
        this.entities.push(entity)
    }

    async save() {

    }

    async load() {

    }
}

export default EntityPack
