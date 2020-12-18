import events from './events'

export async function init() {
    const { value: token } = await this.store.get('token')
    if (token) this.token = token

    const { refreshTokenUpdateOffset } = this.options

    if (refreshTokenUpdateOffset) {
        this.on(events.token, ({ refreshUntil }) => {
            clearTimeout(this._refreshTokenControlTimeout)
            const now = new Date()
            const millisecons = refreshUntil - now
            this._refreshTokenControlTimeout = setTimeout(millisecons - refreshTokenUpdateOffset, () => {
                this._checkToken()
            })
        })
    }
}

export function uninit() {
    return new Promise(resolve => {
        if (this._uniniting) resolve()
        this._uniniting = true

        clearTimeout(this._refreshTokenControlTimeout)
        clearTimeout(this._maxRequestControlTimeout)

        const finish = () => {
            this._uniniting = false
            resolve()
        }

        if (this._tokenUpdating) {
            this.on(events.token, finish)
        } else {
            finish()
        }
    })
}
