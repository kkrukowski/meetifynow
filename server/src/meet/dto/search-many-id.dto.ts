import { IsNotEmpty } from 'class-validator';

export class SearchManyIdDto {
  @IsNotEmpty()
  id: string[];
}
