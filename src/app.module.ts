import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitmqModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
