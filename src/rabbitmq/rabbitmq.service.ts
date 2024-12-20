import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authService: ClientProxy,
    @Inject("COMPANIES_SERVICE") private readonly companiesService: ClientProxy
  ) {}

  rpcSend(
    service: string,
    pattern: string,
    data: object = {}
  ): Observable<any> {
    try {
      return this[service].send(pattern, data);
    } catch (error) {
      throw error;
    }
  }
}
