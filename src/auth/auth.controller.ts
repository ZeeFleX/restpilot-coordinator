import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { ISignUpRequestDTO, ICompanySignUpRequestDTO } from "src/types/shared";

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @MessagePattern("coordinator.user.signUp")
  signUp(@Payload() user: ISignUpRequestDTO) {
    return this.service.signUp(user);
  }

  @MessagePattern("coordinator.company.signUp")
  companySignUp(@Payload() company: ICompanySignUpRequestDTO) {
    return this.service.companySignUp(company);
  }
}
