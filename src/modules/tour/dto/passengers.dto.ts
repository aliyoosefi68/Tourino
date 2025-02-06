import { ApiProperty } from "@nestjs/swagger";
import { createPassengerDto } from "./single-passenger.dto";

export class CreatePassengersDto {
  @ApiProperty({
    description: "List of passengers to be registered",
    type: [createPassengerDto], // آرایه‌ای از CreatePassengerDto
  })
  passengers: createPassengerDto[];
}
