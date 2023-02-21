import { AxiosRequestConfig } from 'axios'
import { Integration } from '~/integration'

export type OAuthToken = {
    access: string,
    accessUntil: Date,
    refresh: string,
}

export type ClientOptions = {
    integration: Integration,
    subdomain: string,
    token?: OAuthToken,
    mainDomain?: string
}

export type ClientRequestConfig<D = undefined> = AxiosRequestConfig<D> & {
    useToken?: boolean,
    ifModifiedSince?: Date,
}
