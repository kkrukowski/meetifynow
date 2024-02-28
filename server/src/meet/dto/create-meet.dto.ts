import { IsNotEmpty } from 'class-validator';

export class CreateMeetDto {
  @IsNotEmpty()
  meetName: string;

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
