import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as express from "express";
import { join } from "path";
import * as basicAuth from "express-basic-auth";
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.use("/uploads", express.static(join(__dirname, "..", "uploads")));
    if (process.env.NODE_ENV !== "production") {
        app.use(
            ["/swagger", "api-json"],
            basicAuth({
                challenge: true,
                users: {
                    BLOGBACK: "eRQA}DpfZZKIM*7T{Qog4=Un@%sF&RbY",
                },
            }),
        );

        const config = new DocumentBuilder()
            .setTitle("Cloudy Application")
            .setDescription("")
            .setVersion("1.0")
            .addBearerAuth(
                { type: "http", scheme: "bearer", bearerFormat: "JWT" },
                "Bearer",
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup("/swagger", app, document);
    }
    await app.listen(AppModule.port);
    console.log("application started on port:", AppModule.port);
}
bootstrap();
