import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { AuthDTO } from "shared-types";
import { CommandBus } from "@nestjs/cqrs";
import { SagaInvocationError, SagaCompensationError } from "nestjs-saga";
import { CompanySignUpCommand } from "./sagas";
import { firstValueFrom } from "rxjs";
import { Logger } from "shared-functions";

@Controller()
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private commandBus: CommandBus
  ) {}

  @MessagePattern("coordinator.user.signUp")
  @Logger("magenta")
  signUp(@Payload() user: AuthDTO.Request.SignUp) {
    return this.service.userCreate(user);
  }

  @MessagePattern("coordinator.company.signUp")
  @Logger("magenta")
  async companySignUp(@Payload() company: AuthDTO.Request.CompanySignUp) {
    try {
      const commandResult = await this.commandBus.execute(
        new CompanySignUpCommand(company)
      );

      if (commandResult.error) {
        throw new RpcException(commandResult.error);
      }

      return commandResult;
    } catch (error) {
      return error.originalError || error;
    }
  }
}
