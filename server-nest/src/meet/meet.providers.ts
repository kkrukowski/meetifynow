import { Mongoose } from 'mongoose';
import { MeetSchema } from '../database/schemas/meet.schema';

export const meetProviders = [
  {
    provide: 'MEET_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Meet', MeetSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
