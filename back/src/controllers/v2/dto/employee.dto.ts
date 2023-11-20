import { Role } from '@app/domain/model/Role';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty({
    description: 'Email of the employee.',
    example: 'john.doe@proxym.fr',
  })
  email: string;
  name: string;
  lastname: string;
  role: Role;
  projects: string[] = [];
}
