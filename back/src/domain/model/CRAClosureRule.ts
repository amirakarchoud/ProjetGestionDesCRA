import { ActivityRule } from './ActivityRule';
import { Instant, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';
import { DateProvider } from './date-provider';
import { ActivityError } from '@app/domain/model/errors/activity.error';

export class CRAClosureRule implements ActivityRule {
  /**
   * Validates that today's date is contained in the closureInterval
   *
   * @param activity the activity
   * @param craInterval the interval of a CRA. ([firstDayOfMonth, lastDayOfMonth])
   * @param closureInterval the closure interval of a CRA. ([firstDateOfMonth, closureDayOfNextMonth])
   */
  validateRule(
    activity: Activity,
    craInterval: Interval,
    closureInterval: Interval,
  ) {
    const dataTime = DateProvider.today().atStartOfDay(ZoneId.systemDefault());

    const result = closureInterval.contains(Instant.from(dataTime));
    if (!result) {
      throw new ActivityError('Cannot add activity outside CRA dates');
    }
  }
}
