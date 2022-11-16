import {Field, InputType} from "@nestjs/graphql";
import {IsEmail, IsString} from "class-validator";

@InputType()
export class EmailDto {
    @IsString()
    @IsEmail()
    @Field(type => String, {nullable: false, name: "email"})
    email: string
}
