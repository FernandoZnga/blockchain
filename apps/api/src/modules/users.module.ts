import { Module } from "@nestjs/common";
import { UsersController } from "../routes/users.controller";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
