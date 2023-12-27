import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MeetDocument = HydratedDocument<Meet>;

@Schema()
export class DateData {
  @Prop({ type: Number, required: true })
  meetDate: number;

  @Prop({ type: Boolean, required: true })
  isOnline: boolean;
}

export const DateDataSchema = SchemaFactory.createForClass(DateData);

@Schema()
export class Answer {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: [DateDataSchema], required: true })
  dates: DateData[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema()
export class DayTimes {
  @Prop({ type: Number, required: true })
  date: number;

  @Prop({ type: [Number], required: true })
  times: number[];
}

export const DayTimesSchema = SchemaFactory.createForClass(DayTimes);

@Schema()
export class Meet {
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

  @Prop({ type: [DayTimesSchema], required: true })
  dayTimes: DayTimes[];

  @Prop({ type: [AnswerSchema], required: true })
  answers: Answer[];
}

export const MeetSchema = SchemaFactory.createForClass(Meet);
