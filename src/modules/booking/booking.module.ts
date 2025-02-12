import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { TourService } from "../tour/services/tour.service";
import { PassengerService } from "../tour/services/passenger.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TourEntity } from "../tour/entity/tour.entity";
import { PassengerEntity } from "../tour/entity/passenger.entity";
import { BookingEntity } from "./entity/booking.entity";
import { BookingController } from "./booking.controller";
import { AuthModule } from "../auth/auth.module";
import { TourModule } from "../tour/tour.module";
import { S3Service } from "../s3/s3.service";

@Module({
  imports: [
    AuthModule,
    TourModule,
    TypeOrmModule.forFeature([TourEntity, PassengerEntity, BookingEntity]),
  ],
  providers: [BookingService, TourService, S3Service, PassengerService],
  controllers: [BookingController],
})
export class BookingModule {}
