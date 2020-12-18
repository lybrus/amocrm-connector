export default class Store {
    constructor(store) {
        this.store = store
    }

    async set(key, value, updatedAt, ttl) {
        if (!this.store) return

        if (!updatedAt) updatedAt = new Date()

        await this.store.set(key, value, updatedAt, ttl)
    }

    async get(key) {
        if (!this.store) {
            return {
                value: undefined,
                updatedAt: undefined
            }
        }

        const data = await this.store.get(key)

        if (!data) {
            return {
                value: undefined,
                updatedAt: undefined
            }
        }
        return data
    }
}
