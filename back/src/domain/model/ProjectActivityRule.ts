import { ActivityRule } from './ActivityRule';
import { Instant, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';
import { ActivityError } from '@app/domain/model/errors/activity.error';

export class ProjectActivityRule implements ActivityRule {
  /**
   * Validates that the activity date is contained in the craInterval
   *
   * @param activity the activity
   * @param craInterval the interval of a CRA. ([firstDayOfMonth, lastDayOfMonth])
   * @param closureInterval the closure interval of a CRA. ([firstDateOfMonth, closureDayOfNextMonth])
   */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  validateRule(
    activity: Activity,
    craInterval: Interval,
    closureInterval: Interval,
  ): void {
    const actDate = activity.date.atStartOfDay(ZoneId.systemDefault());
    const instant = Instant.from(actDate);
    const result = craInterval.contains(instant);
    if (!result) {
      throw new ActivityError('Activity outside of current CRA');
    }
  }
}
