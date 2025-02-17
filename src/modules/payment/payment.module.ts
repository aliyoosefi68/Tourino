import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentEntity } from "./entity/payment.entity";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { BookingService } from "../booking/booking.service";
import { BookingEntity } from "../booking/entity/booking.entity";
import { BookingModule } from "../booking/booking.module";
import { ZarrinpalService } from "../http/zarrinpal.service";
import { HttpService } from "@nestjs/axios";

@Module({
  imports: [
    AuthModule,
    BookingModule,
    TypeOrmModule.forFeature([PaymentEntity]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
