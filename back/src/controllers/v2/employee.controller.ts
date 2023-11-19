import { Collab } from '@app/domain/model/Collab';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CollabEmail } from '@app/domain/model/collab.email';
import { CraApplication } from '@app/domain/application/cra.application';
import { CreateEmployeeDto } from '@app/controllers/v2/dto/create-employee.dto';
import { Response } from 'express';
import { ProjectCode } from '@app/domain/model/project.code';

export const EMPLOYEE_URI = '/v2/private/employees';

@ApiTags('v2', 'Employee')
@Controller(EMPLOYEE_URI)
export class EmployeeController {
  constructor(private readonly craApplication: CraApplication) {}

  @Get('')
  @ApiOperation({
    summary: 'List all employees',
    description: 'Retrieve a list of employees registered in the application.',
  })
  @ApiQuery({
    name: 'emailFilter',
    description:
      'Optionally provide a comma separated list of emails to filter.',
    required: false,
  })
  async listEmployees(
    @Query('emailFilter') emailFilter: string,
  ): Promise<Collab[]> {
    if (emailFilter) {
      return await this.craApplication.getAllCollabsByIds(
        emailFilter.split(',').map((id) => new CollabEmail(id)),
      );
    }
    return await this.craApplication.getAllCollabs();
  }

  @Post('')
  @ApiOperation({
    summary: 'Add an employee.',
    description: 'Add a new employee to the application',
  })
  async addCollab(@Body() employeeDto: CreateEmployeeDto): Promise<void> {
    const collab = new Collab(
      new CollabEmail(employeeDto.email),
      employeeDto.name,
      employeeDto.lastname,
      employeeDto.role,
      employeeDto.projects.map((project) => new ProjectCode(project)),
    );
    await this.craApplication.addCollab(collab);
  }
}
