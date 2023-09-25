import { Controller, Get, UseGuards} from "@nestjs/common";
import { JwtAuthGuard } from "./../../core/guards/jwt-guard.guard";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "./../../core/decorators/user.decorator";
import { Roles } from "src/core/decorators/roles.decorator";
import { RoleGuard } from "src/core/guards/roles.guard";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @ApiBearerAuth("Bearer")
    @UseGuards(JwtAuthGuard)
    @Get("/getCurrentProfil")
    async getCurrentProfil(@UserDecorator() user) {
        console.log("getCurrentProfil"+ user.id);
        return await this.usersService.getUserById(user.id);
    }

    @ApiBearerAuth("Bearer")
    @Roles("ADMIN")
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Get("/all")
    async getAll() {
        return await this.usersService.getAll();
    }

}
