import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetModule } from './meet/meet.module';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule, MeetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
