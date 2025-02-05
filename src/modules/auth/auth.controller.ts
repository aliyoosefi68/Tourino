import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { CheckOtpDto, LoginDto, SendOtpDto, SignupDto } from "./dto/auth.dto";
import { Request } from "express";
import { AuthGuard } from "./guards/auth.guard";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @Post("login")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("send-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post("check-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto);
  }

  @Post("forget-password")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  forgetPassword() {}

  @Post("refresh-token")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  refreshToken() {}

  @Get("check-login")
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}
