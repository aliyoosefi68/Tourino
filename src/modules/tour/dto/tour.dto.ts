import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { TransferType } from "../enum/transfer.enum";
import { StatusTour } from "../enum/status.enum";
import { IsEnum, Length } from "class-validator";

export class CreateTourDto {
  @ApiProperty()
  @Length(10, 100, {
    message: "توضیحات سفر باید بین 10 تا 100 کارکتر باشد",
  })
  title: string;
  @ApiProperty()
  @Length(100, 2000, {
    message: "توضیحات سفر باید بین 100 تا 2000 کارکتر باشد",
  })
  description: string;
  @ApiProperty({ format: "binary" })
  image: string;
  @ApiProperty()
  capacity: number;
  @ApiProperty()
  usage: number;
  @ApiProperty()
  price: number;
  @ApiProperty()
  origin: string;
  @ApiProperty()
  destination: string;
  @ApiProperty()
  date_gone: Date;
  @ApiProperty()
  date_return: Date;
  @ApiProperty({ default: false })
  haveInsurance: boolean;
  @ApiProperty({ nullable: true })
  insuance_detai: string;
  @ApiProperty({ enum: TransferType })
  @IsEnum(TransferType, { message: "نوع حمل و نقل را به درستی انتخاب کنید" })
  transfer: string;
  @ApiProperty({ enum: StatusTour, default: StatusTour.InProgress })
  @IsEnum(StatusTour, { message: "نوع وضعیت را به درستی انتخاب کنید" })
  status: string;
  @ApiProperty({ nullable: true })
  discount: number;
  @ApiPropertyOptional({ nullable: true, default: false })
  active_discount: boolean;
  @ApiProperty({ nullable: true })
  leaderId: number;
}
export class UpdateTourDto extends PartialType(CreateTourDto) {}
