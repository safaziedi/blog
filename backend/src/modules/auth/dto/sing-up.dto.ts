import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "./../../../core/enums/user-role.enum";

export class singUpDto {
    @ApiProperty()
        email: string;

    @ApiProperty({
        enum: UserRole,
        examples: [UserRole.USER, UserRole.ADMIN],
    })
        role: UserRole;

    @ApiProperty()
        password: string;
}
