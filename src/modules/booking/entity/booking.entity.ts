import { EntityNames } from "src/common/enums/entity.enum";
import { PassengerEntity } from "src/modules/tour/entity/passenger.entity";
import { TourEntity } from "src/modules/tour/entity/tour.entity";
import { UserEntiy } from "src/modules/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity(EntityNames.Booking)
export class BookingEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: false }) // وضعیت پرداخت
  isPaid: boolean;
  @Column()
  tourId: number;
  @ManyToOne(() => TourEntity, (tour) => tour.bookings, { onDelete: "CASCADE" })
  tour: TourEntity;

  @OneToMany(() => PassengerEntity, (passenger) => passenger.booking, {
    onDelete: "CASCADE",
  })
  passengers: PassengerEntity[];
  @Column()
  userId: number;
  @ManyToOne(() => UserEntiy, (user) => user.bookings, { onDelete: "CASCADE" })
  user: UserEntiy;

  @CreateDateColumn()
  createdAt: Date;
}
