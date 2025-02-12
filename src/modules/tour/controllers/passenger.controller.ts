import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { PassengerService } from "../services/passenger.service";
import { createPassengerDto } from "../dto/single-passenger.dto";

@Controller("passenger")
@ApiTags("Passenger")
export class PassengerController {
  constructor(private passengerService: PassengerService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createPassengers(@Body() createPassengerDto: createPassengerDto) {
    return this.passengerService.createPassenger(createPassengerDto);
  }

  @Get("/tour/:tourId")
  getPassengerOfTour(@Param("tourId", ParseIntPipe) tourId: number) {
    return this.passengerService.getPassengerOfTour(+tourId);
  }
  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    this.passengerService.removePassenger(+id);
  }
}
