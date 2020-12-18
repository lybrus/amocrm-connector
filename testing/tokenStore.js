import path from 'path'
import fs from 'fs'

const tokenPath = path.resolve(__dirname, 'token.json')

export const saveToken = token => {
    fs.writeFileSync(tokenPath, JSON.stringify(token))
}

export const loadToken = () => {
    const token = JSON.parse(fs.readFileSync(tokenPath))

    token.accessUntil = new Date(token.accessUntil)
    token.refreshUntil = new Date(token.refreshUntil)

    return token
}
