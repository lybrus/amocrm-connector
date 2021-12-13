import EventEmitter from 'events'
import Leads from '~/schemas/Leads'
import Store from './Store'
import { init, uninit } from './lifecycle'
import request from './request'
import { getOAuthLink, getToken, checkToken } from './auth'
import { MAX_REQUESTS_PER_SECOND } from '~/constants'

export class AmoCRM extends EventEmitter {
    constructor({
        credential,
        token = undefined,
        options: {
            refreshTokenOnRequest = true,
            refreshTokenUpdateOffset = 0,
            store = undefined,
            debug = false,
            maxRequestsPerSecond = MAX_REQUESTS_PER_SECOND
        } = {}
    } = {}) {
        super()

        this.credential = credential
        this.token = token
        this.options = {
            refreshTokenOnRequest,
            refreshTokenUpdateOffset,
            store,
            debug,
            maxRequestsPerSecond
        }

        this.store = new Store(store)

        this.leads = new Leads(this)
    }

    async handleWebhook(data) {
    }

    init = init
    uninit = uninit

    getOAuthLink = getOAuthLink
    getToken = getToken
    _checkToken = checkToken

    request = request
    get = (options) => request.call(this, { method: 'GET', ...options })
    post = (options) => request.call(this, { method: 'POST', ...options })
    patch = (options) => request.call(this, { method: 'PATCH', ...options })

    debug = (title, data) => {
        const { options: { debug } } = this
        if (debug) {
            const record = [`[DEBUG] AmoCRM - ${title},  ${new Date()}`]
            if (data) record.push(data)
            console.log(...record)
        }
    }
}

export { default as events } from './events'
