import { Collab } from '../../domain/model/Collab';
import { EmployeeDto } from '../../dtos/v2/employee.dto';

export const mapEmployee = (collab: Collab) => {
  const employeeDto = new EmployeeDto();
  employeeDto.email = collab.email.value;
  employeeDto.name = collab.name;
  employeeDto.lastname = collab.lastname;
  employeeDto.role = collab.role;
  employeeDto.projects = collab.projects.map((projectId) => projectId.value);

  return employeeDto;
};
