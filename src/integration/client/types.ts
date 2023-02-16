import { AxiosRequestConfig } from 'axios'
import { Integration } from '~/integration'

export type OAuthToken = {
    access: string,
    accessUntil: Date,
    refresh: string,
}

export type ClientOptions = {
    integration: Integration,
    domain: string,
    token?: OAuthToken,
}

export type ClientRequestConfig<D = undefined> = AxiosRequestConfig<D> & {
    useToken?: boolean,
    ifModifiedSince?: Date,
}
