import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('CloudinaryContentInputType', { isAbstract: true })
@ObjectType()
export class CloudinaryContent {
  @Field((type) => String)
  url: string;
  @Field((type) => String)
  publicId: string;
}
