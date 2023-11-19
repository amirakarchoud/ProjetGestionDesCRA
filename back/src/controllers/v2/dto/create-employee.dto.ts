import { Role } from '@app/domain/model/Role';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'The email address of the new employee',
    example: 'john.doe@proxym.fr',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `Employee's first name`,
    example: 'John',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: `Employee's family name`,
    example: 'Doe',
  })
  @IsString()
  lastname: string;

  @ApiProperty({
    description: `Role of the employee in the company`,
    examples: [Role.user, Role.admin],
    default: Role.user,
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'List of project Ids that this user can report for.'
  })
  @IsString({
    each: true,
  })
  projects: string[] = [];
}
