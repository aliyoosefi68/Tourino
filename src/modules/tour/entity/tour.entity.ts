import { EntityNames } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TransferType } from "../enum/transfer.enum";
import { StatusTour } from "../enum/status.enum";
import { PassengerEntity } from "./passenger.entity";
import { UserEntiy } from "src/modules/user/entity/user.entity";
import { BookingEntity } from "src/modules/booking/entity/booking.entity";

@Entity(EntityNames.Tour)
export class TourEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column({ type: "text" })
  description: string;
  @Column()
  image: string;
  @Column({ nullable: true })
  imageKey: string;
  @Column()
  capacity: number;
  @Column()
  usage: number;
  @Column({ type: "decimal" })
  price: number;
  @Column()
  origin: string;
  @Column()
  destination: string;
  @Column()
  date_gone: Date;
  @Column()
  date_return: Date;
  @Column({ default: false })
  haveInsurance: boolean;
  @Column({ nullable: true })
  insuance_detai: string;
  @Column({ nullable: true, type: "enum", enum: TransferType })
  transfer: string;
  @Column({ type: "enum", enum: StatusTour, default: StatusTour.InProgress })
  status: string;
  @Column({ nullable: true })
  discount: number;
  @Column({ nullable: true, default: false })
  active_discount: boolean;
  @Column({ nullable: true })
  leaderId: number;
  @OneToMany(() => UserEntiy, (user) => user.myTours)
  leader: UserEntiy[];
  @Column({ nullable: true, type: "text" })
  plane: string;
  @OneToMany(() => PassengerEntity, (passenger) => passenger.tour)
  passengers: PassengerEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.tour)
  bookings: BookingEntity[];

  @CreateDateColumn()
  create_at: Date;
}
