import bent from 'bent'

class RequestError extends Error {
    constructor(response) {
        super('request exception, see response property')
        this.response = response
        console.error(response)
    }
}

export const request = async (method, url, data, headers) => {
    let statusCode; let statusMessage; let responseHeaders; let getJson; let getText; let error = false

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

    if (error && Math.floor(statusCode / 100) !== 2) throw new RequestError(response)

    return response
}

export const amoRequest = async ({
    method = 'GET',
    domain,
    path,
    data,
    token,
    ifModifiedSince
}) => {
    const url = `https://${domain}.amocrm.ru${path}`
    const headers = {}

    if (token) headers.Authorization = `Bearer ${token}`
    if (ifModifiedSince) headers['If-Modified-Since'] = ifModifiedSince.toUTCString()

    const response = await request(method, url, data, headers)

    return response
}
