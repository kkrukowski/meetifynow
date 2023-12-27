import { Answer } from './answer.interface';
import { DayTimes } from './dayTimes.interface';

export interface Meet {
  readonly appointmentId: string;
  readonly meetName: string;
  readonly place: string;
  readonly link: string;
  readonly dayTimes: DayTimes[];
  readonly answers: Answer[];
}
