import { Controller } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { AuthDTO } from "src/types/shared";
import { CommandBus } from "@nestjs/cqrs";
import { SagaInvocationError, SagaCompensationError } from "nestjs-saga";
import { CompanySignUpCommand } from "./sagas";
import { firstValueFrom } from "rxjs";

@Controller()
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private commandBus: CommandBus
  ) {}

  @MessagePattern("coordinator.user.signUp")
  signUp(@Payload() user: AuthDTO.Request.SignUp) {
    return this.service.userCreate(user);
  }

  @MessagePattern("coordinator.company.signUp")
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
