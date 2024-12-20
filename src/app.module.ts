import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitmqModule } from "./rabbitmq/rabbitmq.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RabbitmqModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
