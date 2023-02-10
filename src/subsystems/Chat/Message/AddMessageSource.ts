import {Prop} from '~/decorators'
import {AmoDTO} from '~/core'

export class AddMessageSource extends AmoDTO {
    @Prop()
    externalId!: string
}
