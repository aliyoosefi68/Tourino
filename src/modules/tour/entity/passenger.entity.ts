import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntiy } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TourEntity } from "./tour.entity";

@Entity(EntityNames.Passenger)
export class PassengerEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  userId: number;
  @Column()
  tourId: number;
  @ManyToOne(() => UserEntiy, (user) => user.tours)
  user: UserEntiy;
  @ManyToOne(() => TourEntity, (tour) => tour.passengers)
  tour: TourEntity;
}
