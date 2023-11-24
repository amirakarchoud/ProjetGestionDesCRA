import { ActivityRule } from './ActivityRule';
import { Instant, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';

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
  ): boolean {
    const actDate = activity.date.atStartOfDay(ZoneId.systemDefault());
    return craInterval.contains(Instant.from(actDate));
  }
}
