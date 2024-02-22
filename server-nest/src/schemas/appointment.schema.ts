import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeetDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  @Prop({ type: String, required: true })
  appointmentId: string;

  @Prop({ type: String, required: true })
  meetName: string;

  @Prop({
    type: String,
    set: (place) => (place === '' ? undefined : place),
  })
  place: string;

  @Prop({
    type: String,
    set: (link) => (link === '' ? undefined : link),
  })
  link: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
