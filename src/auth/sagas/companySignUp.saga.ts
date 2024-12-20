import { Builder, Saga } from "nestjs-saga";
import { AuthDTO, AuthEntities, CompaniesEntities } from "src/types/shared";
import { AuthService } from "../auth.service";
import { firstValueFrom } from "rxjs";

export class CompanySignUpCommand {
  constructor(public readonly data: AuthDTO.Request.CompanySignUp) {}
}

interface SagaResult {
  user: Partial<AuthEntities.User>;
  company: Partial<CompaniesEntities.Company>;
}

@Saga(CompanySignUpCommand)
export class CompanySignUpSaga {
  result: SagaResult = {
    user: {},
    company: {},
  };
  constructor(private readonly service: AuthService) {}

  saga = new Builder<CompanySignUpCommand, SagaResult>()
    .step("User and Company Registration")
    .invoke(async (cmd: CompanySignUpCommand) => {
      const { phone, password } = cmd.data;
      this.result.user = await firstValueFrom(
        this.service.userCreate({ phone, password })
      );

      console.log(this.result);
    })
    .step("Company Registration")
    .invoke(async (cmd: CompanySignUpCommand) => {
      const { name, address } = cmd.data;
      this.result.company = await firstValueFrom(
        this.service.companyCreate({ name, address })
      );
    })
    .withCompensation(() => {
      console.log("Компенсация регистрации пользователя и компании");
    })
    .return(() => {
      return this.result;
    })
    .build();
}
