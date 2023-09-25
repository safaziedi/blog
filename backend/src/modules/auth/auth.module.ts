import { Module } from "@nestjs/common";
import { AuthConstants } from "./../../core/constants/auth-constants";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/user.schema";
@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        UsersModule,
        JwtModule.register({
            secret: AuthConstants.secretOrKey,
            signOptions: {
                expiresIn: AuthConstants.expiresIn,
            },
        })
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
