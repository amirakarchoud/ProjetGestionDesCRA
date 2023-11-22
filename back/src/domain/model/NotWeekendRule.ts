import { ActivityRule } from './ActivityRule';
import { isWeekend } from './date.utils';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';

export class NotWeekendRule implements ActivityRule {

  /**
   * Validates that the activity date is not a weekend.
   *
   * @param activity the activity
   * @param craInterval the interval of a CRA. ([firstDayOfMonth, lastDayOfMonth])
   * @param closureInterval the closure interval of a CRA. ([firstDateOfMonth, closureDayOfNextMonth])
   */
  validateRule(activity: Activity, craInterval: Interval, closureInterval: Interval): boolean {
    return !isWeekend(activity.date);
  }
}