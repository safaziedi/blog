import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "./../../core/enums/user-role.enum";
import { Document } from "mongoose";
@Schema()
export class User {
    @Prop()
        email: string;

    @Prop({ default: UserRole.USER })
        role: UserRole;

    @Prop()
        password: string;

}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
