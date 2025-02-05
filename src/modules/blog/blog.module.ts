import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entity/blog.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  providers: [],
  controllers: [],
})
export class BlogModule {}
