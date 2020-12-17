import EventEmitter from 'events'
import Leads from '~/schemas/Leads'
import { amoRequest } from './request'
import Store from './Store'
import { DELAY_ON_429_CODE, MAX_REQUESTS_PER_SECOND, REFRESH_TOKEN_LIFETIME } from './constants'

export const events = {
    token: 'token'
}

export class AmoCRM extends EventEmitter {
    constructor({
        credential,
        token = undefined,
        options: {
            refreshTokenUpdateOffset = 0,
            store = undefined,
            debug = false
        } = {}
    } = {}) {
        super()

        this.credential = credential
        this.token = token
        this.options = {
            refreshTokenUpdateOffset,
            store,
            debug
        }

        this.store = new Store(store)

        this.leads = new Leads(this)
    }

    getOAuthLink(state, mode = 'post_message') {
        const { integrationId } = this.credential
        return `https://www.amocrm.ru/oauth?client_id=${integrationId}&state=${state}&mode=${mode}`
    }

    async init() {
        const { value: token } = await this.store.get('token')
        if (token) this.token = token

        this._requestCnt = 0
        this._requestLimitControlInterval = setInterval(() => {
            if (this._requestCnt > 0) this._requestCnt--
        }, 1000 / MAX_REQUESTS_PER_SECOND)

        const { refreshTokenUpdateOffset } = this.options
        this._refreshTokenControlInterval = setInterval(() => {
            if (this.token) {
                const { refreshUntil } = this.token
                const now = new Date()
                if (refreshUntil > now && refreshUntil.setSeconds(refreshUntil.getSeconds() - refreshTokenUpdateOffset) < now) {
                    this.checkToken()
                }
            }
        }, refreshTokenUpdateOffset / 2)
    }

    uninit() {
        return new Promise(resolve => {
            if (this._uniniting) resolve()
            this._uniniting = true

            clearInterval(this._requestLimitControlInterval)
            if (this._tokenUpdating) {
                this.on(events.token, finish)
                return
            }

            finish()

            function finish() {
                this._uniniting = false
                resolve()
            }
        })
    }

    async getToken({
        code,
        refreshToken
    }) {
        const {
            integrationId,
            secretKey,
            redirectUri
        } = this.credential

        const data = {
            client_id: integrationId,
            client_secret: secretKey,
            redirect_uri: redirectUri
        }
        if (code) {
            data.code = code
            data.grant_type = 'authorization_code'
        }
        if (refreshToken) {
            data.refreshToken = refreshToken
            data.grant_type = 'refresh_token'
        }

        const response = await this.request({
            method: 'POST',
            path: '/oauth2/access_token',
            data,
            useToken: false
        })

        const {
            data: {
                expires_in: expiresIn,
                access_token: accessToken,
                refresh_token: newRefreshToken
            }
        } = response

        const now = new Date()
        const accessUntil = new Date(now)
        accessUntil.setSeconds(accessUntil.getSeconds() + expiresIn)
        const refreshUntil = new Date(now)
        refreshUntil.setMonth(accessUntil.getMonth() + REFRESH_TOKEN_LIFETIME)

        const token = {
            access: accessToken,
            accessUntil,
            refresh: newRefreshToken,
            refreshUntil
        }

        this.token = token
        this.emit(events.token, token)
        await this.store.set('token', token)

        return token
    }

    async handleWebhook(data) {
    }

    async checkToken() {
        if (this.token) {
            const {
                accessUntil,
                refresh,
                refreshUntil
            } = this.token
            const now = new Date()

            if (accessUntil && now < accessUntil) return
            if (refreshUntil && now > refreshUntil) {
                this.token = undefined
                return
            }

            this._tokenUpdating = true
            await this.getToken({ refreshToken: refresh })
            this._tokenUpdating = false
        }
    }

    async request({
        method = 'GET',
        path,
        data,
        ifModifiedSince,
        useCache = false,
        cacheTTL = 300,
        useToken = true
    }) {
        this._requestCnt++

        if (this._requestCnt > MAX_REQUESTS_PER_SECOND) throw new Error('Max limit per second reached')

        const { domain } = this.credential
        let token, cachedValue, cacheKey

        if (useToken) {
            await this.checkToken()
            token = this.token?.access
        }

        if (useCache) {
            cacheKey = `cache:path=${path}`
            const {
                value,
                updatedAt
            } = await this.amocrm.store.get(cacheKey)
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

        if (statusCode === 429) this._requestCnt = MAX_REQUESTS_PER_SECOND * DELAY_ON_429_CODE

        if (useCache) {
            if (statusCode === 304) {
                response.data = cachedValue
            } else {
                this.amocrm.store.set(cacheKey, response.data, undefined, cacheTTL)
            }
        }

        return response
    }

    debug(title, data) {
        console.log(`[DEBUG] AmoCRM - ${title},  ${new Date()}`, data)
    }
}
