import { Injectable } from "@nestjs/common";
import {
  AuthDTO,
  AuthEntities,
  CompaniesDTO,
  CompaniesEntities,
} from "shared-types";
import { RabbitmqService } from "src/rabbitmq/rabbitmq.service";
import { Observable, firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private readonly RMQ: RabbitmqService) {}

  userCreate(
    user: AuthDTO.Request.SignUp
  ): Observable<AuthEntities.User> | any {
    try {
      return this.RMQ.rpcSend("authService", "auth.user.create", user);
    } catch (error) {
      console.log(error);
      return {
        error: "ОШИБКА",
      };
    }
  }

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

  companyCreate(
    company: CompaniesDTO.Request.CreateCompany
  ): Observable<CompaniesEntities.Company> {
    try {
      return this.RMQ.rpcSend(
        "companiesService",
        "companies.company.create",
        company
      );
    } catch (error) {
      return error;
    }
  }
}
