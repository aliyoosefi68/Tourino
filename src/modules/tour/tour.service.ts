import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TourEntity } from "./entity/tour.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateTourDto, UpdateTourDto } from "./dto/tour.dto";
import { S3Service } from "../s3/s3.service";
import { AuthService } from "../auth/auth.service";
import { Roles } from "src/common/enums/role.enum";
import {
  AuthMessage,
  LeaderMessage,
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
  }
  async remove() {}
  async getAll() {
    return await this.tourRepository.find({});
  }
}
