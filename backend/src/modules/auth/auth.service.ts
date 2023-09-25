import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { singUpDto } from "./dto";
import { signInDto } from "./dto/sign-in.dto";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/user.schema";
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        @InjectModel("User") private userModel: Model<User>,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}


    async signIn(dto: signInDto) {
        const user = await this.usersService.getUserbyemail(dto.email);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const [salt, storedhash] = user.password.split(".");

        const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
        if (storedhash === hash.toString("hex")) {
            const token = this.jwtService.sign({
                id: user._id,
                email: user.email,
                role: user.role,
            });

            return { token: token, role: user.role };
        } else {
            throw new UnauthorizedException("Incorrect password");
        }
    }

    async signUp(dto: singUpDto) {
        try {
            // see if the user already exists
            const users = await this.usersService.getUserbyemail(dto.email);
            if (users) {
                throw new BadRequestException("email in use");
            }

            // hash the password
            const salt = randomBytes(8).toString("hex");
            const hash = (await scrypt(dto.password, salt, 32)) as Buffer;
            const result = salt + "." + hash.toString("hex");

            // save hashed password
            dto.password = result;
            //create a new user as User and save it in the database
            const newUser = new this.userModel({
                ...dto,
            });
            const code = Math.floor(
                Math.random() * (999999 - 100000 + 1) + 100000,
            );

            await newUser.save();
            return code;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getInfoUser(email: string) {
        return await this.usersService.getUserbyemail(email);
    }

}
