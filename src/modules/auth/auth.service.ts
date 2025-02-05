import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntiy } from "../user/entity/user.entity";
import { Repository } from "typeorm";
import {
  CheckOtpDto,
  LoginDto,
  RefreshTokenDto,
  SendOtpDto,
  SignupDto,
} from "./dto/auth.dto";
import { mobileValidation } from "src/common/utils/mobile.util";
import { AuthMessage, ConflictMessage } from "src/common/enums/message.enum";
import { randomPassword } from "src/common/utils/password.util";
import { isMobilePhone } from "class-validator";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntiy) private userRepository: Repository<UserEntiy>,
    private jwtService: JwtService
  ) {}

  async signUp(signupDto: SignupDto) {
    const { firstname, lastname, mobile } = signupDto;
    const { phoneNumber } = mobileValidation(mobile);

    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (user) throw new ConflictException(ConflictMessage.Phone);
    let { password, hashed } = randomPassword(8);
    await this.userRepository.insert({
      firstname,
      lastname,
      mobile: phoneNumber,
      password: hashed,
    });
    return {
      message: AuthMessage.SignUpSucessfully,
      password,
    };
  }

  async login(loginDto: LoginDto) {
    const { password, username } = loginDto;
    let user = await this.userRepository.findOneBy({ username });
    if (!user && isMobilePhone(username, "fa-IR"))
      user = await this.userRepository.findOneBy({ mobile: username });
    if (!user) throw new UnauthorizedException(AuthMessage.TryAgain);
    if (compareSync(password, user.password)) {
      return this.tokenGenerator(user.id, user.mobile);
    }
    throw new UnauthorizedException(AuthMessage.TryAgain);
  }
  async sendOtp(sendOtpDto: SendOtpDto) {
    const { mobile } = sendOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);
    if (user.otp_expired_in >= new Date()) {
      throw new BadRequestException(AuthMessage.TryAgain);
    }
    const otpCode = randomInt(10000, 99999);
    user.otp_code = String(otpCode);
    user.otp_expired_in = new Date(new Date().getTime() + 1000 * 60);
    await this.userRepository.save(user);
    return {
      message: AuthMessage.SendOtpCodeSuccessfully,
      code: otpCode,
    };
  }
  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { mobile, code } = checkOtpDto;
    const { phoneNumber } = mobileValidation(mobile);
    let user = await this.userRepository.findOneBy({ mobile: phoneNumber });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);
    if (user.otp_expired_in < new Date())
      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    if (code === user.otp_code) {
      return this.tokenGenerator(user.id, user.mobile);
    }
    throw new UnauthorizedException("کد ارسال شده صحیح نمییاشد");
  }

  async findOneUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);
    return user;
  }

  async forgetPassword() {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const { userId, phone } = this.verifyRefreshToken(refreshToken);
    if (userId && phone) return this.tokenGenerator(+userId, phone);
    throw new UnauthorizedException(AuthMessage.TryAgain);
  }

  async tokenGenerator(userId: number, phone: string) {
    const accessToken = this.jwtService.sign(
      { userId, phone },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: "1d" }
    );
    const refreshToken = this.jwtService.sign(
      { userId, phone },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: "30d" }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      const verified = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (
        verified?.userId &&
        verified?.phone &&
        !isNaN(parseInt(verified.userId))
      )
        return verified;
      throw new UnauthorizedException(AuthMessage.TryAgain);
    } catch (err) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }
  verifyAccessToken(token: string) {
    try {
      const verified = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (
        verified?.userId &&
        verified?.phone &&
        !isNaN(parseInt(verified.userId))
      )
        return verified;
      throw new UnauthorizedException(AuthMessage.TryAgain);
    } catch (err) {
      throw new UnauthorizedException(AuthMessage.TryAgain);
    }
  }

  async validateAccessToken(token: string) {
    const { userId, phone } = this.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({
      id: userId,
      mobile: phone,
    });
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
    return user;
  }
}
