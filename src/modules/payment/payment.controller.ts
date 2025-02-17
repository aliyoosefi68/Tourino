import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { PaymentDto } from "./dto/payment.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { Response } from "express";

@Controller("payment")
@ApiTags("Payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  @AuthDecorator()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  gatewayURL(@Body() paymentDto: PaymentDto) {
    return this.paymentService.gatewayURL(paymentDto);
  }

  @Get("/verify")
  async verifyPayment(
    @Query("Authority") authority: string,
    @Query("Statue") status: string,
    @Res() res: Response
  ) {
    const url = await this.paymentService.verify(authority, status);
    return res.redirect(url);
  }
}
