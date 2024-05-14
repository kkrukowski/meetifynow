import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from 'src/schemas/appointment.schema';
import { MeetController } from './meet.controller';
import { MeetService } from './meet.service';
import { User, UserSchema } from '../schemas/user.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  controllers: [MeetController],
  providers: [MeetService],
})
export class MeetModule {}
