import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MeetController } from './meet.controller';
import { meetProviders } from './meet.providers';
import { MeetService } from './meet.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MeetController],
  providers: [MeetService, ...meetProviders],
})
export class MeetModule {}
