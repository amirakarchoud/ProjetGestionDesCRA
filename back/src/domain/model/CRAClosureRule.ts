import { ActivityRule } from './ActivityRule';
import { Instant, LocalDate, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';
import { ActivityError } from '@app/domain/model/errors/activity.error';
import { DateProvider } from '@app/domain/model/date-provider';

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
    const today = DateProvider.today();
    const craEndDate = LocalDate.ofInstant(craInterval.end());

    // IF NOT IN THE FUTURE
    if (craEndDate.isBefore(today)) {
      const dataTime = today.atStartOfDay(ZoneId.systemDefault());

      const result = closureInterval.contains(Instant.from(dataTime));
      if (!result) {
        throw new ActivityError(
          'Cannot add activity outside CRA closure dates',
        );
      }
    } // IF IN THE FUTURE
  }
}
