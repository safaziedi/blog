import { Injectable } from "@nestjs/common";
import { singUpDto } from "./../auth/dto/sing-up.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async createUser(dto: singUpDto) {
        const createdUser = await this.userModel.create(dto);
        return createdUser;
    }
    async getUserById(id: string) {
        return await this.userModel.findOne({ _id: id });
    }
    async getUserbyemail(email: string) {
        return await this.userModel.findOne({ email: email });
    }
    getAll() {
        return this.userModel.find({});
    }
}
