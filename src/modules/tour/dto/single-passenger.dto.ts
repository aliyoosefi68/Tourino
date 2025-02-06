import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateDateColumn } from "typeorm";
export class createPassengerDto {
  @ApiProperty({
    description: "First name of the passenger",
    example: "Ali",
  })
  firstname: string;

  @ApiProperty({
    description: "Last name of the passenger",
    example: "Rezaei",
  })
  lastname: string;

  @ApiProperty({
    description: "Identity number of the passenger",
    example: "123456789",
  })
  identity: string;

  @ApiProperty({
    description: "ID of the associated tour",
    example: 1,
    type: Number,
  })
  tourId: number;

  @ApiPropertyOptional({
    description: "ID of the user associated with the passenger",
    example: 1,
    type: Number,
  })
  userId: number;
  @CreateDateColumn()
  created_at: Date;
}
