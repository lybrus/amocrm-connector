import { getAmo } from '~/../testing/tools'

describe('Leads methods', () => {
    test('Get leads', async () => {
        const amocrm = getAmo()

        // eslint-disable-next-line no-unused-vars
        const leads = await amocrm.leads.getList()
    })
})
