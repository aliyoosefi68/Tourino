import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TourEntity } from "./entity/tour.entity";
import { PassengerEntity } from "./entity/passenger.entity";
import { TourController } from "./controllers/tour.controller";

import { S3Service } from "../s3/s3.service";
import { AuthModule } from "../auth/auth.module";
import { PassengerController } from "./controllers/passenger.controller";
import { TourService } from "./services/tour.service";
import { PassengerService } from "./services/passenger.service";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([TourEntity, PassengerEntity]),
  ],
  providers: [TourService, PassengerService, S3Service],
  controllers: [TourController, PassengerController],
})
export class TourModule {}
