import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetModule } from './meet/meet.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONN_URI),
    MeetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
