import { ConfigurableModuleBuilder, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { TourModule } from "./tour/tour.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env"),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    TourModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
