import request from './request'
import { uninit } from './lifecycle'

jest.mock('../request')

const limit = 5

describe('AmoCRM request', () => {
    test('Request limit control should reject excess request', done => {
        (async () => {
            const context = {
                request,
                credential: {},
                options: {
                    maxRequestsPerSecond: limit
                },
                _checkToken() {
                }
            }

            // Chunk of request should pass limit control
            for (let i = 0; i < limit; i++) {
                await context.request({})
            }

            // Wait more 1 second, and try again
            setTimeout(async () => {
                // Chunk of request should pass limit control again
                for (let i = 0; i < limit; i++) {
                    await context.request({})
                }

                let exception = false

                try {
                    await context.request({})
                } catch {
                    exception = true
                }

                expect(exception).toEqual(true)

                uninit.call(context)

                done()
            }, 1200)
        })()
    })
})
