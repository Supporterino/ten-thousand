import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from '@app/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
