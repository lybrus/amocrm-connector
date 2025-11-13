import { DTOLike, JSONObject } from '~/dto'
import { Service } from '~/service'
import { AddCallRequest } from './add-call-request'
import { AddCallResponse } from './add-call-response'

export class Calls extends Service {
    async add(calls: DTOLike<AddCallRequest> | DTOLike<AddCallRequest>[]): Promise<AddCallResponse[]> {
        const { client } = this
        const data = AddCallRequest.process(calls instanceof Array ? calls : [calls])

        const { data: { _embedded } } = await client.post<JSONObject>({
            url: '/api/v4/calls',
            data
        })

        const responseCalls = (_embedded as JSONObject).calls as JSONObject[]
        return AddCallResponse.import(responseCalls) as AddCallResponse[]
    }
}
