import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Appointment } from './appointment.schema';

@Schema()
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Appointment',
  })
  appointments: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String })
  emailToken: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
