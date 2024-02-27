import { IsNotEmpty } from 'class-validator';
import { DateData } from 'src/schemas/appointment.schema';

export class NewAnswerDto {
  userId: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  dates: DateData[];
}
