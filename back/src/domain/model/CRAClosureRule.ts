import { ActivityRule } from './ActivityRule';
import { Instant, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';
import { DateProvider } from './date-provider';

export class CRAClosureRule implements ActivityRule {

  /**
   * Validates that today's date is contained in the closureInterval
   *
   * @param activity the activity
   * @param craInterval the interval of a CRA. ([firstDayOfMonth, lastDayOfMonth])
   * @param closureInterval the closure interval of a CRA. ([firstDateOfMonth, closureDayOfNextMonth])
   */
  validateRule(activity: Activity, craInterval: Interval, closureInterval: Interval): boolean {
    const dataTime = DateProvider.today().atStartOfDay(ZoneId.systemDefault());
    return closureInterval.contains(Instant.from(dataTime));
  }
}