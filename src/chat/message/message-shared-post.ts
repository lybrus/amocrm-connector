import { Prop, DTO } from '~/dto'

export enum MessageSharedPostType {
    Post = 'post'
}

export class MessageSharedPost extends DTO {
    @Prop()
    url!: string

    @Prop()
    previewLink?: string

    @Prop()
    previewPermalink?: string

    @Prop()
    type!: MessageSharedPostType

    @Prop()
    siteName?: string
}
