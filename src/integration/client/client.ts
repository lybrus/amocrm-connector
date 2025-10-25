import axios, { AxiosResponse } from 'axios'
import { ClientRequestConfig, OAuthToken, ClientOptions } from './types'
import { Account, Calls } from './subsystems'
import { Integration } from '~/integration'
import EventEmitter from 'events'

interface AmoCRMEventMap {
    'token': OAuthToken
}

export class Client extends EventEmitter {
    integration: Integration
    subdomain: string
    mainDomain: string
    token?: OAuthToken
    account: Account = new Account(this)
    calls: Calls = new Calls(this)

    constructor(options: ClientOptions) {
        super()

        const {
            integration,
            subdomain,
            mainDomain = 'amocrm.ru',
            token
        } = options

        this.integration = integration
        this.subdomain = subdomain
        this.mainDomain = mainDomain

        if (token) {
            const { accessUntil, ...rest } = token
            this.token = {
                accessUntil: typeof accessUntil === 'string' ? new Date(accessUntil) : accessUntil,
                ...rest
            }
        }
    }

    tokenIsActual(): boolean {
        const accessUntil = this.token?.accessUntil
        return !!accessUntil && new Date() < accessUntil
    }

    async getToken({ code, refreshToken }: { code?: string, refreshToken?: string } = {}) {
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

        const { token } = this

        if (!code && !refreshToken && token) {
            const { refresh } = token
            data['refresh_token'] = refresh
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

    request<T = unknown, D = unknown>(config: ClientRequestConfig<D>): Promise<AxiosResponse<T, D>> {
        const {
            useToken = true,
            ifModifiedSince,
            data: rawData,
            headers = {},
            method = 'GET',
            url,
            baseURL = `https://${this.subdomain}.${this.mainDomain}`,
            dto,
            ...rest
        } = config
        if (!url) throw new Error('url is required')

        const data = (dto && rawData) ? dto.process(rawData) : rawData

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
