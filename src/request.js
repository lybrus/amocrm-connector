import bent from 'bent'

export class RequestError extends Error {
    constructor(response, debug = false) {
        super('request exception, see response property')
        this.response = response
        if (process.env.NODE_ENV !== 'test' && !debug) console.error(response)
    }
}

export const request = async (method, url, data, headers, debug = undefined) => {
    let statusCode
    let statusMessage
    let responseHeaders
    let getJson
    let getText
    let error = false

    if (debug) {
        debug('Request', {
            method,
            url,
            headers,
            data
        })
    }

    try {
        const response = await bent(method.toUpperCase(), 200)(url, data, headers)
        statusCode = response.statusCode
        statusMessage = response.statusMessage
        responseHeaders = response.headers
        getJson = response.json
        getText = response.text
    } catch (e) {
        statusCode = e.statusCode
        statusMessage = e.message
        responseHeaders = e.headers
        getJson = e.json
        getText = e.text
        error = true
    }

    let json = false
    let responseData
    if (responseHeaders && /application\/.*json/i.test(responseHeaders['content-type'])) {
        json = true
        responseData = await getJson()
    } else if (getText) {
        responseData = await getText()
    }

    const response = {
        statusCode,
        statusMessage,
        headers: responseHeaders,
        json,
        data: responseData
    }

    if (debug) {
        debug('Response', response)
    }

    if (error &&
        Math.floor(statusCode / 100) !== 2 && // accept all 2xx codes
        statusCode !== 304 && // accept 304, not modified
        statusCode !== 429 // accept 429 to stop sending requests
    ) {
        throw new RequestError(response, debug)
    }

    return response
}

export const amoRequest = async ({
    method = 'GET',
    domain,
    path,
    data,
    token,
    ifModifiedSince,
    debug = undefined
}) => {
    const url = `https://${domain}.amocrm.ru${path}`
    const headers = {}

    if (token) headers.Authorization = `Bearer ${token}`
    if (ifModifiedSince) headers['If-Modified-Since'] = ifModifiedSince.toUTCString()

    const response = await request(method, url, data, headers, debug)

    return response
}
