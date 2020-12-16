import { amoRequest } from '~/request'

const domain = process.env.DOMAIN

describe('Request method', () => {
    test('', async done => {
        try {
            await amoRequest({
                domain,
                path: '/api/v4/leads'
            })
        } catch (e) {
            const { response: { statusCode } } = e
            expect(statusCode).toBe(401)
        }

        done()
    })
})
