import { EntityNames } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Gender } from "../enum/gender.enum";
import { TourEntity } from "src/modules/tour/entity/tour.entity";
import { PassengerEntity } from "src/modules/tour/entity/passenger.entity";
import { Roles } from "src/common/enums/role.enum";

@Entity(EntityNames.User)
export class UserEntiy {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  firstname: string;
  @Column()
  lastname: string;
  @Column({ nullable: true, type: "enum", enum: Gender })
  gender: string;
  @Column({ nullable: true, type: "enum", enum: Roles, default: Roles.User })
  role: string;
  @Column({ nullable: true })
  age: number;
  @Column({ unique: true })
  mobile: string;
  @Column({ nullable: true })
  email: string;
  @Column({ nullable: true })
  username: string;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true, unique: true })
  identity: string;
  @Column({ nullable: true, type: "date" })
  birthDate: Date;
  @CreateDateColumn()
  created_at: Date;
  @Column({ nullable: true })
  otp_code: string;
  @Column({ nullable: true })
  otp_expired_in: Date;
  @OneToMany(() => PassengerEntity, (passenger) => passenger.tour)
  tours: TourEntity[];
  @OneToMany(() => TourEntity, (tour) => tour.leader)
  myTours: TourEntity[];
}
