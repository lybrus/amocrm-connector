export type JSONPrimitive = null | number | string
export type JSONObject = { [key: string]: JSONType }
export type JSONObjectOrArray = JSONObject | JSONObjectOrArray[]
export type JSONType = JSONPrimitive | JSONObject | JSONType[]
