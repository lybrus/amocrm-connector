import { AxiosRequestConfig } from 'axios'
import { Integration } from '~/integration'
import { DTO } from '~/dto'

export type OAuthToken = {
    access: string,
    accessUntil: Date,
    refresh: string,
}

export type OAuthRawToken = Omit<OAuthToken, 'accessUntil'> & {
    accessUntil: string
}

export type ClientOptions = {
    integration: Integration,
    subdomain: string,
    token?: OAuthToken | OAuthRawToken,
    mainDomain?: string
}

export type ClientRequestConfig<D = undefined> = AxiosRequestConfig<D> & {
    useToken?: boolean,
    ifModifiedSince?: Date,
    dto?: typeof DTO
}
