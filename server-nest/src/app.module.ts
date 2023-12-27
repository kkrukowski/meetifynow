import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

console.log('process.env.DB_CONN_URI', process.env.DB_CONN_URI);

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_CONN_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
