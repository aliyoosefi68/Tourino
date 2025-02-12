import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { BookingDto } from "./dto/booking.dto";

@Controller("booking")
@ApiTags("Booking")
@AuthDecorator()
export class BookingController {
  constructor(private readonly bookingServie: BookingService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  createBooking(@Body() bookDto: BookingDto) {
    return this.bookingServie.createBooking(+bookDto.tourId);
  }

  @Get("/my-booking")
  getBookingByUserId() {
    return this.bookingServie.getBookingByUser();
  }
}
