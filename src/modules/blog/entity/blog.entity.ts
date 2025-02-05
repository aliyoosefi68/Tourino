import { EntityNames } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity(EntityNames.Blog)
export class BlogEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  title: string;
  @Column()
  slug: string;
  @Column()
  description: string;
  @Column()
  content: string;
  @Column()
  image: string;
  @CreateDateColumn()
  created_at: Date;
}
