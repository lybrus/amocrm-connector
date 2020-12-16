export const REFRESH_TOKEN_LIFETIME = 3 // months

// Recommendations https://www.amocrm.ru/developers/content/api/recommendations
// recommended value 250, max 500
export const MAX_AMOUNT_OF_ENTITIES_BY_QUERY = 250

// max value 7
export const MAX_REQUESTS_PER_SECOND = 5

// 429 code means limit of requests was reached
export const DELAY_ON_429_CODE = 5 // seconds
