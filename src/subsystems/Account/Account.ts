import {Subsystem} from '~/subsystems'
import {JSONObject} from '~/tools/types/json'
import {AccountInfo} from './AccountInfo'

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
    async get(...withParams: AccountWith[]): Promise<AccountInfo>
    async get(withParams: AccountWith[]): Promise<AccountInfo>
    async get(): Promise<AccountInfo>
    async get(...withParams: AccountWith[] | [AccountWith[]] | []): Promise<AccountInfo> {
        const {amocrm} = this
        if (withParams && (withParams[0] instanceof Array)) withParams = withParams[0]
        const {data} = await amocrm.get<JSONObject, null>({
            params: {
                'with': withParams?.join(',')
            },
            url: '/api/v4/account'
        })

        return AccountInfo.import(data)
    }
}
