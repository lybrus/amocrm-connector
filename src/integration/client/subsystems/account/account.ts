import { Subsystem } from '../subsystem'
import { JSONObject } from '~/dto'
import { AccountInfo } from './account-info'

export enum AccountWith {
    amojoId = 'amojo_id',
    amojoRights = 'amojo_rights',
    usersGroups = 'users_groups',
    taskTypes = 'task_types',
    version = 'version',
    entityNames = 'entity_names',
    datetimeSettings = 'datetime_settings'
}

export class Account extends Subsystem {
    async getAccountInfo(...withParams: AccountWith[]): Promise<AccountInfo>
    async getAccountInfo(withParams: AccountWith[]): Promise<AccountInfo>
    async getAccountInfo(): Promise<AccountInfo>
    async getAccountInfo(...withParams: AccountWith[] | [AccountWith[]] | []): Promise<AccountInfo> {
        const { client } = this
        if (withParams && (withParams[0] instanceof Array)) withParams = withParams[0]
        const { data } = await client.get<JSONObject, null>({
            params: {
                'with': withParams?.join(',')
            },
            url: '/api/v4/account'
        })

        return AccountInfo.import(data)
    }
}
