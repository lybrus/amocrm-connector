// import { RequestError } from '../request'

let _response = {
    statusCode: 200,
    statusMessage: 'OK',
    headers: {},
    json: true,
    data: {}
}
let _error = false

export function _setResponse(response, error = false) {
    _response = response
    _error = error
}

export const amoRequest = async () => {
    const error = new Error()
    error.response = _response
    if (_error) throw error
    return _response
}
