import { DELAY_ON_429_CODE } from '~/constants'
import { amoRequest } from '~/request'

export default async function request({
    method = 'GET',
    path,
    data,
    ifModifiedSince,
    useCache = false,
    cacheTTL = 300,
    useToken = true
}) {
    requestControl.call(this)

    const { domain } = this.credential
    let token, cachedValue, cacheKey

    if (useToken) {
        await this._checkToken()
        token = this.token?.access
    }

    if (useCache) {
        cacheKey = `cache:path=${path}`
        const {
            value,
            updatedAt
        } = await this.store.get(cacheKey)
        cachedValue = value

        if (updatedAt) ifModifiedSince = updatedAt
    }

    const { options: { debug } } = this

    const response = await amoRequest({
        method,
        domain,
        path,
        data,
        token,
        ifModifiedSince,
        debug: debug ? this.debug : false
    })

    const { statusCode } = response

    statusCode429Control.call(this, statusCode)

    if (useCache) {
        if (statusCode === 304) {
            response.data = cachedValue
        } else {
            this.amocrm.store.set(cacheKey, response.data, undefined, cacheTTL)
        }
    }

    return response
}

function requestControl() {
    if (!this._requestSequence) {
        this._requestSequence = []
    }

    const {
        _requestSequence: seq,
        options: { maxRequestsPerSecond }
    } = this

    if (seq.length >= maxRequestsPerSecond) throw new Error('Max limit per second reached')

    seq.push(new Date())

    const shiftSequence = () => {
        const { _requestSequence: seq } = this
        seq.shift()

        if (seq.length > 0) {
            const now = new Date()
            const firstRequestTime = seq[0]
            this._maxRequestControlTimeout = setTimeout(shiftSequence, 1000 - (now - firstRequestTime))
        }
    }

    if (seq.length === 1) {
        this._maxRequestControlTimeout = setTimeout(shiftSequence, 1000)
    }
}

function statusCode429Control(statusCode) {
    if (statusCode === 429) {
        clearTimeout(this._maxRequestControlTimeout)
        const { options: { maxRequestsPerSecond } } = this

        this._requestSequence = Array.from(Array(maxRequestsPerSecond))
        this._maxRequestControlTimeout = setTimeout(() => {
            this._requestSequence = []
        }, DELAY_ON_429_CODE * 1000)
    }
}
