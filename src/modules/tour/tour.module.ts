import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TourEntity } from "./entity/tour.entity";
import { PassengerEntity } from "./entity/passenger.entity";
import { TourController } from "./tour.controller";
import { TourService } from "./tour.service";
import { S3Service } from "../s3/s3.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TourEntity, PassengerEntity]),
  ],
  providers: [TourService, S3Service],
  controllers: [TourController],
})
export class TourModule {}
