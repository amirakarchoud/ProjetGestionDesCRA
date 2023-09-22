import { ApiProperty } from '@nestjs/swagger';
import { Raison } from '@app/domain/model/Raison';

export class DeleteActivityAbsenceDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  date: Date;
  @ApiProperty()
  raison: Raison;
  @ApiProperty()
  projectCode: string;
}
