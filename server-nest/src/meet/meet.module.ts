import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from 'src/schemas/appointment.schema';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [MeetController],
  providers: [MeetService],
})
export class MeetModule {}
