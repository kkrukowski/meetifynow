import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateMeetDto {
  @IsNotEmpty()
  meetName: string;

  authorId: ObjectId;

  place: string;

  link: string;

  @IsNotEmpty()
  dates: {
    date: number;
    times: number[];
  }[];

  answers: {
    userId: string;
    username: string;
    dates: {
      meetDate: number;
      isOnline: boolean;
    }[];
  }[];
}
