import { ApiProperty } from "@nestjs/swagger";

export class BookingDto {
  @ApiProperty()
  tourId: number;
}
