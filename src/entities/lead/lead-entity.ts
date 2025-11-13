import { BaseEntity, Entity } from '~/entity'
import { DateSerializerTimestamp, DTO, Id, Prop } from '~/dto'
import { LeadWithParams } from './lead-with-params'

interface LeadParams extends EcdsaParams {
    id: number
    withParams: LeadWithParams
}

@Entity({
    pluralName: 'leads'
})
export class Lead extends BaseEntity<LeadParams> {
    @Id()
    @Prop()
    id!: number

    @Prop()
    name!: string

    @Prop()
    price!: number

    @Prop()
    responsibleUserId!: number

    @Prop()
    groupId!: number

    @Prop()
    statusId!: number

    @Prop()
    pipelineId!: number

    @Prop()
    lossReasonId?: number

    @Prop()
    sourceId?: number

    @Prop()
    createdBy!: number

    @Prop()
    updatedBy!: number

    @Prop({ serializer: DateSerializerTimestamp })
    closedAt?: Date

    @Prop({ serializer: DateSerializerTimestamp })
    createdAt!: Date

    @Prop({ serializer: DateSerializerTimestamp })
    updatedAt!: Date

    @Prop({ serializer: DateSerializerTimestamp, optional: true })
    closestTaskAt?: Date

    @Prop()
    isDeleted!: boolean

    @Prop({ optional: true })
    customFieldsValues?: CustomFieldValue[]

    @Prop()
    score?: number

    @Prop()
    accountId!: number

    @Prop()
    laborCost!: number

    @Prop()
    isPriceModifiedByRobot?: boolean
}

class CustomFieldValue extends DTO {

}