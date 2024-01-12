import { ActivityRule } from './ActivityRule';
import { isWeekend } from './date.utils';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';
import { ActivityError } from '@app/domain/model/errors/activity.error';

export class NotWeekendRule implements ActivityRule {
  /**
   * Validates that the activity date is not a weekend.
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
    if (isWeekend(activity.date)) {
      throw new ActivityError('Adding an activity during a weekend');
    }
  }
}
