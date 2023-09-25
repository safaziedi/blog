import { JwtAuthGuard } from "./../../core/guards/jwt-guard.guard";
import {
    Body,
    Controller,
    Post,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import {
    ApiBearerAuth,
    ApiTags,
} from "@nestjs/swagger";
import { signInDto } from "./dto/sign-in.dto";
import { singUpDto } from "./dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post("/singup")
    async signUp(@Body() dto: singUpDto) {
        return await this.authService.signUp(dto);
    }

    @Post("/signin")
    async signIn(@Body() dto: signInDto) {
        return await this.authService.signIn(dto);
    }


    @ApiBearerAuth("Bearer")
    @UseGuards(JwtAuthGuard)
    @Post("logout")
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie("jwt");
        return {
            message: "logged out successfully ",
        };
    }
}
