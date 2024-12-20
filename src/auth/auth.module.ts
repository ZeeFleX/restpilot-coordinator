import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SagaModule } from "nestjs-saga";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RabbitmqModule } from "src/rabbitmq/rabbitmq.module";
import { CompanySignUpSaga } from "./sagas";

@Module({
  imports: [
    RabbitmqModule,
    CqrsModule,
    SagaModule.register({
      imports: [RabbitmqModule],
      providers: [AuthService],
      sagas: [CompanySignUpSaga],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
