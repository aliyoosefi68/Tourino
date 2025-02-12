import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntiy } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TourEntity } from "./tour.entity";
import { BookingEntity } from "src/modules/booking/entity/booking.entity";

@Entity(EntityNames.Passenger)
export class PassengerEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  firstname: string;
  @Column()
  lastname: string;

  @Column()
  identity: string;

  @Column()
  tourId: number;
  @ManyToOne(() => TourEntity, (tour) => tour.passengers)
  tour: TourEntity;

  @Column()
  userId: number;
  @ManyToOne(() => UserEntiy, (user) => user.passengers)
  user: UserEntiy;

  @ManyToOne(() => BookingEntity, (booking) => booking.passengers, {
    onDelete: "CASCADE",
  })
  booking: BookingEntity;
}
