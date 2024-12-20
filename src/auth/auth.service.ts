import { Injectable } from "@nestjs/common";
import {
  ISignUpRequestDTO,
  ICompanySignUpRequestDTO,
  IUser,
} from "src/types/shared";
import { RabbitmqService } from "src/rabbitmq/rabbitmq.service";
import { Observable, firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private readonly RMQ: RabbitmqService) {}

  signUp(user: ISignUpRequestDTO): Observable<IUser> {
    try {
      return this.RMQ.rpcSend("authService", "user.signUp", user);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async companySignUp({
    phone,
    password,
    name,
    address,
  }: ICompanySignUpRequestDTO) {
    try {
      const createdUser = await firstValueFrom(
        this.signUp({
          phone,
          password,
        })
      );

      console.log(createdUser);

      return this.RMQ.rpcSend("companiesService", "company.create", {
        name,
        address,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
