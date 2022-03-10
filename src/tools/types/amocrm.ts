import {AxiosRequestConfig} from 'axios'

export type AmoCRMCredential = {
    domain: string,
    integrationId: string,
    secretKey: string,
    redirectUri?: string,
    chatSecret?: string,
    chatId?: string
}
export type AmoCRMToken = {
    access: string,
    accessUntil: Date,
    refresh: string
}
export type AmoCRMOptions = {
    credential: AmoCRMCredential,
    token?: AmoCRMToken,
}
export type AmoCRMRequestConfig<D = undefined> = AxiosRequestConfig<D> & {
    useToken?: boolean,
    ifModifiedSince?: Date
}
