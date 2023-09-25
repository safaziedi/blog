import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConstants } from "./../../../core/constants/auth-constants";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            //ignoreExpiration: false,
            secretOrKey: AuthConstants.secretOrKey,
        });
    }
    async validate(payload) {
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
    }
}
