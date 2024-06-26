import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class DateData {
  @Prop({ type: Number, required: true })
  meetDate: number;

  @Prop({ type: Boolean, required: true })
  isOnline: boolean;
}

@Schema()
export class Answer {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    set: (userId: string) => (userId === '' ? undefined : userId),
  })
  userId: User;

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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    set: (authorId: string) => (authorId === '' ? undefined : authorId),
  })
  authorId: User;

  @Prop({ type: String, required: true })
  meetName: string;

  @Prop({
    type: String,
    set: (place: string) => (place === '' ? undefined : place),
  })
  meetPlace: string;

  @Prop({
    type: String,
    set: (link: string) => (link === '' ? undefined : link),
  })
  meetLink: string;

  @Prop({ type: [DayTimes], required: true })
  dates: DayTimes[];

  @Prop({ type: [Answer] })
  answers: Answer[];

  @Prop({ type: Date })
  createdAt: Date;
}

export type MeetDocument = HydratedDocument<Appointment>;
export type DayTimesDocument = HydratedDocument<DayTimes>;
export type AnswerDocument = HydratedDocument<Answer>;
export type DateDataDocument = HydratedDocument<DateData>;

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
export const DayTimesSchema = SchemaFactory.createForClass(DayTimes);
export const AnswerSchema = SchemaFactory.createForClass(Answer);
export const DateDataSchema = SchemaFactory.createForClass(DateData);
