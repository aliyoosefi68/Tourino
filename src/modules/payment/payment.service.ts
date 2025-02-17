import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BookingService } from "../booking/booking.service";
import { ZarrinpalService } from "../http/zarrinpal.service";
import { PaymentDataDto, PaymentDto } from "./dto/payment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entity/payment.entity";
import { Repository } from "typeorm";
import { PublicMessage } from "src/common/enums/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private bookingService: BookingService,
    private zarinpalService: ZarrinpalService,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>
  ) {}

  async gatewayURL(paymentDto: PaymentDto) {
    const { description } = paymentDto;
    const user = this.req.user;
    const booking = await this.bookingService.getBookingByUser();
    const payment = await this.create({
      amount: parseInt(booking.totalPrice.toString()),
      bookingId: booking.id,
      status: booking.totalPrice === 0 ? true : false,
      userId: user.id,
      invoice_number: new Date().getTime().toString(),
    });
    if (payment.status) {
      const { authority, code, gatewayURL } =
        await this.zarinpalService.sendRequest({
          amount: booking.totalPrice,
          description,
          user,
        });
      payment.authority = authority;

      await this.paymentRepository.save(payment);
      return { gatewayURL, code };
    }
    return {
      message: PublicMessage.PaymentSuccessfully,
    };
  }
  async create(paymentDto: PaymentDataDto) {
    const { amount, invoice_number, bookingId, status } = paymentDto;
    const { id: userId } = this.req.user;
    const payment = this.paymentRepository.create({
      amount,
      invoice_number,
      bookingId,
      status,
      userId,
    });
    return await this.paymentRepository.save(payment);
  }

  async verify(authority: string, status: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException("پرداختی وجود ندارد");
    if (payment.status)
      throw new ConflictException("این پرداخت قبلا تایید شده");
    if (status === "OK") {
      let booking = await this.bookingService.findOne(payment.bookingId);
      booking.isPaid = true;
      booking = await this.bookingService.save(booking);
      payment.status = true;
    } else {
      return "http://frontend.com/payment?status=faild";
    }
    this.paymentRepository.save(payment);

    return "http://frontend.com/payment?status=success";
  }
}
