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
      const createUserResponse: AuthDTO.Response.SignUp =
        await this.service.userCreate({ ...cmd.data, role: "OWNER" });

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
      const createCompanyResponse: CompaniesDTO.Response.CreateCompany =
        await this.service.companyCreate({
          ...cmd.data,
          ownerUserId: this.result.user.id,
        });

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
