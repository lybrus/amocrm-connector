import { Service } from '~/service'
import { JSONObject } from '~/dto'
import { AccountInfo } from './account-info'

export enum AccountWith {
    AmojoId = 'amojo_id',
    AmojoRights = 'amojo_rights',
    UsersGroups = 'users_groups',
    TaskTypes = 'task_types',
    Version = 'version',
    EntityNames = 'entity_names',
    DatetimeSettings = 'datetime_settings'
}

export class Account extends Service {
    private amojoId?: string

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

    async getAmojoId() {
        if (this.amojoId) return this.amojoId

        const { amojoId } = await this.getAccountInfo(AccountWith.AmojoId)
        if (!amojoId) throw new Error('amojoId shouln\'t be empty')
        this.amojoId = amojoId

        return amojoId
    }
}
