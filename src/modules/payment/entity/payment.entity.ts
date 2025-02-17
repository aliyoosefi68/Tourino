import { EntityNames } from "src/common/enums/entity.enum";
import { BookingEntity } from "src/modules/booking/entity/booking.entity";
import { UserEntiy } from "src/modules/user/entity/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity(EntityNames.Payment)
export class PaymentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ default: false })
  status: boolean;
  @Column()
  amount: number;
  @Column()
  invoice_number: string;
  @Column({ nullable: true })
  authority: string;

  @Column()
  userId: number;
  @ManyToOne(() => UserEntiy, (user) => user.payments, {
    onDelete: "CASCADE",
  })
  user: UserEntiy;

  @Column()
  bookingId: number;
  @ManyToOne(() => BookingEntity, (booking) => booking.payments, {
    onDelete: "CASCADE",
  })
  booking: BookingEntity;

  @CreateDateColumn()
  created_at: Date;
}
