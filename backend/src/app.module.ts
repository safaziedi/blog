import { Module } from "@nestjs/common";
import { ConfigService } from "./core/config/config.service";
import { CoreModule } from "./core/core.module";
import { ConfigModule } from "./core/config/config.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArticlesModule } from "./modules/articles/articles.module";

@Module({
    imports: [
        CoreModule,
        ConfigModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: `mongodb+srv://${configService.get(
                    "DB_USER",
                )}:${encodeURIComponent(
                    configService.get("DB_PWD"),
                )}@${configService.get("DB_URI")}/${configService.get(
                    "DB_NAME",
                )}?retryWrites=true&w=majority`,
                useNewUrlParser: true,
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        AuthModule,
        ArticlesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    static port: number | string;
    constructor(private _configService: ConfigService) {
        AppModule.port = this._configService.get("PORT");
    }
}
