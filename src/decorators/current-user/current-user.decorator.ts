import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext} from "@nestjs/graphql";

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    return gqlContext["user"]
})
