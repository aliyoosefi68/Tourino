import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TourEntity } from "../entity/tour.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateTourDto, UpdateTourDto } from "../dto/tour.dto";
import { S3Service } from "../../s3/s3.service";
import { AuthService } from "../../auth/auth.service";
import { Roles } from "src/common/enums/role.enum";
import {
  AuthMessage,
  LeaderMessage,
  NotFoundMessage,
  PublicMessage,
} from "src/common/enums/message.enum";
import { toBoolean } from "src/common/utils/functions";

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(TourEntity)
    private tourRepository: Repository<TourEntity>,
    private authService: AuthService,
    private s3Service: S3Service
  ) {}

  async create(createDto: CreateTourDto, image: Express.Multer.File) {
    const { Location, Key } = await this.s3Service.uploadFile(image, "tourino");
    let {
      title,
      description,
      date_gone,
      date_return,
      destination,
      discount,
      active_discount,
      price,
      leaderId,
      origin,
      transfer,
      status,
      haveInsurance,
      insuance_detai,
      usage,
      capacity,
    } = createDto;
    const user = await this.authService.findOneUser(leaderId);
    if (user.role !== Roles.Leader)
      throw new BadRequestException(LeaderMessage.WrongLeader);

    await this.tourRepository.insert({
      title,
      description,
      date_gone,
      date_return,
      destination,
      discount,
      active_discount: toBoolean(active_discount),
      price,
      origin,
      transfer,
      status,
      haveInsurance: toBoolean(haveInsurance),
      insuance_detai,
      usage,
      capacity,
      image: Location,
      leaderId,
    });
    return {
      message: PublicMessage.Created,
    };
  }
  async update(
    id: number,
    image: Express.Multer.File,
    udateDto: UpdateTourDto
  ) {
    let {
      title,
      description,
      date_gone,
      date_return,
      destination,
      discount,
      active_discount,
      price,
      leaderId,
      origin,
      transfer,
      status,
      haveInsurance,
      insuance_detai,
      usage,
      capacity,
    } = udateDto;
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) throw new NotFoundException("تور مورد نظر وجود ندارد");
    const updateObject: DeepPartial<TourEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        "tourino"
      );
      if (Location) {
        updateObject["image"] = Location;
        if (tour?.imageKey) await this.s3Service.deleteFile(tour?.imageKey);
      }
    }
    if (leaderId) {
      const user = await this.authService.findOneUser(leaderId);
      if (user.role !== Roles.Leader)
        throw new BadRequestException(LeaderMessage.WrongLeader);
      updateObject["leaderId"] = leaderId;
    }
    if (title) updateObject["title"] = title;
    if (description) updateObject["description"] = description;
    if (date_gone) updateObject["date_gone"] = date_gone;
    if (date_return) updateObject["date_return"] = date_return;
    if (destination) updateObject["destination"] = destination;
    if (discount) updateObject["discount"] = discount;
    if (active_discount)
      updateObject["active_discount"] = toBoolean(active_discount);
    if (price) updateObject["price"] = price;
    if (origin) updateObject["origin"] = origin;
    if (transfer) updateObject["transfer"] = transfer;
    if (status) updateObject["status"] = status;
    if (capacity) updateObject["capacity"] = capacity;
    if (insuance_detai) updateObject["insuance_detai"] = insuance_detai;
    if (usage) updateObject["usage"] = usage;
    if (haveInsurance) updateObject["haveInsurance"] = toBoolean(haveInsurance);

    await this.tourRepository.update({ id }, updateObject);
    return { message: PublicMessage.Updated };
  }
  async remove(id: number) {
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) throw new NotFoundException(NotFoundMessage.NotFoundTour);
    await this.tourRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }

  async getAll() {
    return await this.tourRepository.find({});
  }

  async getTourByLeader(id: number) {
    const leader = await this.authService.findOneUser(id);
    if (!leader) throw new NotFoundException(NotFoundMessage.NotFoundUser);
    if (leader.role !== Roles.Leader)
      throw new BadRequestException(NotFoundMessage.NotFoundUser);

    const tours = await this.tourRepository.find({
      where: { leaderId: id },
    });
    return tours;
  }
  async getTourById(id: number) {
    const tour = await this.tourRepository.findOne({
      where: { id },
      relations: {
        passengers: true,
      },
      select: {
        passengers: {
          firstname: true,
          lastname: true,
          identity: true,
        },
      },
    });
    if (!tour) throw new NotFoundException(NotFoundMessage.NotFoundTour);
    return tour;
  }
}
