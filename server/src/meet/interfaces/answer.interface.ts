import { DateData } from './dateData.interface';

export interface Answer {
  readonly userId: string;
  readonly username: string;
  readonly dates: DateData[];
}
