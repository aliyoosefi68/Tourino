import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PassengerEntity } from "../entity/passenger.entity";
import { Repository } from "typeorm";
import { TourEntity } from "../entity/tour.entity";
import {
  AuthMessage,
  NotFoundMessage,
  PassengerMessage,
  PublicMessage,
} from "src/common/enums/message.enum";
import { createPassengerDto } from "../dto/single-passenger.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { StatusTour } from "../enum/status.enum";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable({ scope: Scope.REQUEST })
export class PassengerService {
  constructor(
    @InjectRepository(PassengerEntity)
    private passengerRepository: Repository<PassengerEntity>,
    @InjectRepository(TourEntity)
    private tourRepository: Repository<TourEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService
  ) {}

  async createPassenger(createDto: createPassengerDto) {
    const { firstname, lastname, identity, tourId, userId } = createDto;

    const now = new Date();
    const tour = await this.tourRepository.findOneBy({ id: tourId });
    if (!tour) throw new NotFoundException(NotFoundMessage.NotFoundTour);
    if (tour.status !== StatusTour.InProgress)
      throw new BadRequestException(PublicMessage.TourUnavailable);
    if (parseInt(tour.usage.toString()) >= parseInt(tour.capacity.toString()))
      throw new BadRequestException(PublicMessage.TourCapacityComplated);
    if (now.getTime() > tour.date_gone.getTime())
      throw new BadRequestException(PublicMessage.TourExpired);

    let passenger = await this.passengerRepository.findOneBy({
      identity,
      tourId,
    });
    if (passenger)
      throw new BadRequestException(PassengerMessage.AlreadyExistPassenger);

    if (userId) {
      const user = this.authService.findOneUser(userId);
      if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);
    }

    passenger = this.passengerRepository.create({
      userId: userId ?? this.request.user.id,
      tourId,
      lastname,
      firstname,
      identity,
    });
    await this.passengerRepository.save(passenger);

    return { message: PublicMessage.Created };
  }
}
