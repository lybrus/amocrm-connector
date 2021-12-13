import events from './events'
import { REFRESH_TOKEN_LIFETIME } from '~/constants'

export async function checkToken() {
    this.debug('Check token')

    if (!this.token) return false

    const {
        accessUntil,
        refresh,
        refreshUntil
    } = this.token
    const now = new Date()

    if (accessUntil && now < accessUntil) return true

    this.debug('Access token outdated', { accessUntil })

    if (!this.options.refreshTokenOnRequest) return false

    if (refreshUntil && now > refreshUntil) {
        this.token = undefined
        this.debug('Refresh token outdated')
        return false
    }

    this.debug('Refresh token')
    this._tokenUpdating = true
    await this.getToken({ refreshToken: refresh })
    this._tokenUpdating = false

    return true
}

export async function getToken({
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
        data.refresh_token = refreshToken
        data.grant_type = 'refresh_token'
    }

    const response = await this.post({
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
    refreshUntil.setMonth(refreshUntil.getMonth() + REFRESH_TOKEN_LIFETIME)

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

export function getOAuthLink(state, mode = 'post_message') {
    const { integrationId } = this.credential
    return `https://www.amocrm.ru/oauth?client_id=${integrationId}&state=${state}&mode=${mode}`
}
