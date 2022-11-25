import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';
import { MatchesModule } from './modules/matches/matches.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'var/footix.db',
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }), AuthModule, UsersModule, TeamsModule, MatchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
