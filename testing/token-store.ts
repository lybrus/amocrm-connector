import path from 'path'
import fs from 'fs'
import { OAuthToken } from '..'

const tokenPath = path.resolve(__dirname, 'token.json')

export const saveToken = (token: OAuthToken) => {
    fs.writeFileSync(tokenPath, JSON.stringify(token))
}

export const loadToken = () => {
    const token = JSON.parse(fs.readFileSync(tokenPath, { encoding: 'utf-8' }))

    token.accessUntil = new Date(token.accessUntil)
    token.refreshUntil = new Date(token.refreshUntil)

    return token
}
