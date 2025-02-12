import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookingEntity } from "./entity/booking.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { PassengerService } from "../tour/services/passenger.service";
import { TourService } from "../tour/services/tour.service";
import { PublicMessage } from "src/common/enums/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class BookingService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @Inject(REQUEST) private req: Request,
    private passengerService: PassengerService,
    private tourService: TourService
  ) {}

  async createBooking(tourId: number) {
    const { id: userId } = this.req.user;
    const tour = await this.tourService.getTourById(tourId);
    const passengers =
      await this.passengerService.getPassengerOfUserInTour(tourId);
    const passengerCount = passengers.length;
    const totalPrice = passengerCount * tour.price;
    const booking = this.bookingRepository.create({
      userId,
      tourId,
      totalPrice,
      passengers,
    });
    await this.bookingRepository.save(booking);
    return {
      message: PublicMessage.BookingSuccessfully,
    };
  }

  async getBookingByUser() {
    const { id: userId } = this.req.user;
    const booking = await this.bookingRepository.find({
      where: { userId },
    });

    return booking;
  }
}
