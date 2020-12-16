import EventEmitter from 'events'
import EntityPack from './EntityPack'

class Entity extends EventEmitter {
    constructor(owner, data) {
        super()

        const { amocrm } = owner
        this.amocrm = amocrm
        this.owner = owner
        this.data = data
    }

    async save() {
        const pack = new EntityPack([this])
        await pack.save()
    }

    async load() {
        const pack = new EntityPack([this])
        await pack.load()
    }
}

export default Entity
