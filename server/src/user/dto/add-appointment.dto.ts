import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class AddAppointmentDto {
  @IsNotEmpty()
  appointmentId: ObjectId;
}
