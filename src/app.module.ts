import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SpeciesModule } from './species/species.module';
import { BreedsModule } from './breeds/breeds.module';
import { PetsModule } from './pets/pets.module';
import { AddressesModule } from './addresses/addresses.module';
import { ActivitiesModule } from './activities/activity.module';
import { ActivitySchedulesModule } from './activity-schedules/activity-schedules.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ActivityHistoryModule } from './activity-history/activity-history.module';
import { FileCategoriesModule } from './file-categories/file-categories.module';
import { FilesModule } from './files/files.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASS', ''),
        database: configService.get('DB_NAME', 'trackmypet'),
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
    SpeciesModule,
    BreedsModule,
    PetsModule,
    AddressesModule,
    ActivitiesModule,
    ActivitySchedulesModule,
    IncidentsModule,
    ActivityHistoryModule,
    FileCategoriesModule,
    FilesModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
