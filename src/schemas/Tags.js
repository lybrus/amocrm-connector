import Joi from '~/joi'

export const schema = {
    fields: {
        id: Joi.number().integer().positive(),
        name: Joi.string()
    }
}
