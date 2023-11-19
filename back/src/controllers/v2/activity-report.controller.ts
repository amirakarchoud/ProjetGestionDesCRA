import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollabEmail } from '@app/domain/model/collab.email';
import { ActivityReportDto } from '@app/controllers/v2/dto/activity-report.dto';
import { CraApplication } from '@app/domain/application/cra.application';

export const ACTIVITY_REPORT_URI = '/v2/private/activity-report';

@ApiTags('v2', 'Activity')
@Controller(ACTIVITY_REPORT_URI)
export class ActivityReportController {
  constructor(private craApp: CraApplication) {}

  @Post('')
  @ApiOperation({
    summary: 'Create multiple project activities',
    description:
      'Post multiple CRA days with for multiple projects. Usually for an entire week',
  })
  async postBulk(@Body() activityReport: ActivityReportDto) {
    await this.craApp.bulkAdd(
      new CollabEmail(activityReport.employeeEmail),
      activityReport.month,
      activityReport.year,
      activityReport.activities,
    );
  }
}
