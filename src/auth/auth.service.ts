import { Injectable } from "@nestjs/common";
import {
  AuthDTO,
  AuthEntities,
  CompaniesDTO,
  CompaniesEntities,
} from "shared-types";
import { RabbitmqService } from "src/rabbitmq/rabbitmq.service";
import { firstValueFrom } from "rxjs";
import { Logger } from "shared-functions";

@Injectable()
export class AuthService {
  constructor(private readonly RMQ: RabbitmqService) {}

  @Logger("magenta")
  async userCreate(user: AuthDTO.Request.SignUp): Promise<AuthEntities.User> {
    try {
      return await firstValueFrom(
        this.RMQ.rpcSend("authService", "auth.user.create", user)
      );
    } catch (error) {
      return error;
    }
  }

  @Logger("magenta")
  async userDelete(
    user: AuthDTO.Request.UserDelete
  ): Promise<AuthEntities.User> {
    try {
      const userDeleteResponse: AuthEntities.User = await firstValueFrom(
        this.RMQ.rpcSend("authService", "auth.user.delete", user)
      );

      return userDeleteResponse;
    } catch (error) {
      return error;
    }
  }

  @Logger("magenta")
  async companyCreate(
    company: CompaniesDTO.Request.CreateCompany
  ): Promise<CompaniesEntities.Company> {
    try {
      return await firstValueFrom(
        this.RMQ.rpcSend(
          "companiesService",
          "companies.company.create",
          company
        )
      );
    } catch (error) {
      return error;
    }
  }
}
