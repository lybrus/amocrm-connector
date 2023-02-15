import axios, { AxiosResponse } from 'axios'
import { ClientRequestConfig, OAuthToken, ClientOptions } from './types'
import { Account } from './subsystems'
import { Integration } from '~/integration'
import EventEmitter from 'events'

interface AmoCRMEventMap {
    'token': OAuthToken
}

export class Client extends EventEmitter {
    integration: Integration
    domain: string
    token?: OAuthToken
    account: Account = new Account(this)

    constructor(options: ClientOptions) {
        super()

        const {
            integration,
            domain,
            token
        } = options

        this.integration = integration
        this.domain = domain
        this.token = token
    }

    tokenIsActual(): boolean {
        const accessUntil = this.token?.accessUntil
        return !!accessUntil && new Date() < accessUntil
    }

    async getToken({ code, refreshToken }: { code?: string, refreshToken?: string }) {
        const {
            integrationId,
            secretKey,
            redirectUri
        } = this.integration

        const data: { [key: string]: unknown } = {
            client_id: integrationId,
            client_secret: secretKey,
            redirect_uri: redirectUri
        }

        if (code) {
            data['code'] = code
            data['grant_type'] = 'authorization_code'
        }

        if (refreshToken) {
            data['refresh_token'] = refreshToken
            data['grant_type'] = 'refresh_token'
        }

        type AmoCRMTokenRequestResponse = {
            expires_in: number,
            access_token: string,
            refresh_token: string
        }
        const response = await this.post<AmoCRMTokenRequestResponse>({
            url: '/oauth2/access_token',
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

        this.token = {
            access: accessToken,
            accessUntil,
            refresh: newRefreshToken
        }
        this.emit('token', this.token)

        return this.token
    }

    getOAuthLink(state = '', mode: 'post_message' | 'popup' = 'post_message') {
        const { integrationId } = this.integration
        return `https://www.amocrm.ru/oauth?client_id=${integrationId}&state=${state}&mode=${mode}`
    }

    request<T = unknown, D = unknown>(config: ClientRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        const {
            useToken = true,
            ifModifiedSince,
            data,
            headers = {},
            method = 'GET',
            url,
            baseURL = `https://${this.domain}.amocrm.ru`,
            ...rest
        } = config
        if (!url) throw new Error('url is required')

        if (useToken && this.token?.access) headers['Authorization'] = `Bearer ${this.token.access}`
        if (ifModifiedSince) headers['If-Modified-Since'] = ifModifiedSince.toUTCString()

        return axios({ baseURL, headers, data, method, url, ...rest })
    }

    get<T = unknown, D = unknown>(config: ClientRequestConfig<D>) {
        return this.request<T, D>({ method: 'GET', ...config })
    }

    post<T = unknown, D = unknown>(config: ClientRequestConfig<D>) {
        return this.request<T, D>({ method: 'POST', ...config })
    }

    patch<T = unknown, D = unknown>(config: ClientRequestConfig<D>) {
        return this.request<T, D>({ method: 'PATCH', ...config })
    }

    delete<T = unknown, D = unknown>(config: ClientRequestConfig<D>) {
        return this.request<T, D>({ method: 'DELETE', ...config })
    }

    override on<Event extends keyof AmoCRMEventMap>(event: Event, listener: (value: AmoCRMEventMap[Event]) => void): this
    override on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener)
    }

    override addListener<Event extends keyof AmoCRMEventMap>(event: Event, listener: (value: AmoCRMEventMap[Event]) => void): this
    override addListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener)
    }

    override removeListener<Event extends keyof AmoCRMEventMap>(event: Event, listener: (value: AmoCRMEventMap[Event]) => void): this
    override removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.addListener(event, listener)
    }
}