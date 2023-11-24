import { ActivityRule } from './ActivityRule';
import { Instant, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Raison } from './Raison';
import { Activity } from './Activity';
import { Absence } from './Absence';

export class AbsenceRule implements ActivityRule {
  /**
   * Validates that :
   * - if the activity reason is a sickness then
   *     - the activity date must be after or equal than the first day of the CRA.
   * - otherwise
   *     - the activity date must be contained in the craInterval
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
    if (!(activity instanceof Absence)) {
      return false;
    }
    const absDate = activity.date.atStartOfDay(ZoneId.systemDefault());
    const absInstant = Instant.from(absDate);

    return activity.raison !== Raison.Maladie
      ? !absInstant.isBefore(craInterval.start())
      : craInterval.contains(absInstant);
  }
}
