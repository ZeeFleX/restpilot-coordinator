import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { AuthDTO } from "src/types/shared";
import { CommandBus } from "@nestjs/cqrs";
import { SagaInvocationError, SagaCompensationError } from "nestjs-saga";
import { CompanySignUpCommand } from "./sagas";

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
      const result = await this.commandBus.execute(
        new CompanySignUpCommand(company)
      );
      return result;
    } catch (error) {
      if (
        error instanceof SagaInvocationError ||
        error instanceof SagaCompensationError
      ) {
        console.error("Saga error:", error.message);
        throw error;
      }
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}
