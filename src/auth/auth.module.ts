import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RabbitmqModule } from "src/rabbitmq/rabbitmq.module";

@Module({
  imports: [RabbitmqModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
