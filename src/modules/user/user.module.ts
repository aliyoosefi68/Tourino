import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntiy } from "./entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntiy])],
  providers: [],
  controllers: [],
})
export class UserModule {}
