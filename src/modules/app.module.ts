import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { TourModule } from "./tour/tour.module";
import { BookingModule } from "./booking/booking.module";
import { PaymentModule } from "./payment/payment.module";
import { HttpApiModule } from "./http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env"),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    TourModule,
    BookingModule,
    PaymentModule,
    HttpApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
