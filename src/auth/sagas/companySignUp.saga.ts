import { Builder, Saga } from "nestjs-saga";
import {
  AuthDTO,
  CompaniesDTO,
  AuthEntities,
  CompaniesEntities,
} from "shared-types";
import { AuthService } from "../auth.service";
import { firstValueFrom } from "rxjs";
import { RpcException } from "@nestjs/microservices";

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
    .step("User Registration")
    .invoke(async (cmd: CompanySignUpCommand) => {
      const { phone, password } = cmd.data;
      const createUserResponse: AuthDTO.Response.SignUp = await firstValueFrom(
        this.service.userCreate({ phone, password })
      );

      if (createUserResponse.error) {
        throw new RpcException(createUserResponse.error);
      }

      this.result.user = createUserResponse;
    })
    .withCompensation(() => {
      this.service.userDelete({ id: this.result.user.id });
    })
    .step("Company Registration")
    .invoke(async (cmd: CompanySignUpCommand) => {
      const { name, address } = cmd.data;

      const createCompanyResponse: CompaniesDTO.Response.CreateCompany =
        await firstValueFrom(this.service.companyCreate({ name, address }));

      if (createCompanyResponse.error) {
        throw new RpcException(createCompanyResponse.error);
      }

      this.result.company = createCompanyResponse;
    })
    .return(() => {
      return this.result;
    })
    .build();
}
