import {Injectable, InternalServerErrorException, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {UsersService} from "../../users/users.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly userService: UsersService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
            const token = req.headers['x-jwt']
            const decoded = await this.userService.decodeToken(token.toString())
            req["user"] = await this.userService.findUserByEmail(decoded.toString()).catch(err => {
                throw new InternalServerErrorException(err)
            })
        }
        next();
    }
}
