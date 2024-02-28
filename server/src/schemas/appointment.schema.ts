import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class DateData {
  @Prop({ type: Number, required: true })
  meetDate: number;

  @Prop({ type: Boolean, required: true })
  isOnline: boolean;
}

@Schema()
export class Answer {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: [DateData], required: true })
  dates: DateData[];
}

@Schema()
export class DayTimes {
  @Prop({ type: Number, required: true })
  date: number;

  @Prop({ type: [Number], required: true })
  times: number[];
}

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

  @Prop({ type: [DayTimes], required: true })
  dates: DayTimes[];

  @Prop({ type: [Answer] })
  answers: Answer[];
}

export type MeetDocument = HydratedDocument<Appointment>;
export type DayTimesDocument = HydratedDocument<DayTimes>;
export type AnswerDocument = HydratedDocument<Answer>;
export type DateDataDocument = HydratedDocument<DateData>;

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
export const DayTimesSchema = SchemaFactory.createForClass(DayTimes);
export const AnswerSchema = SchemaFactory.createForClass(Answer);
export const DateDataSchema = SchemaFactory.createForClass(DateData);
