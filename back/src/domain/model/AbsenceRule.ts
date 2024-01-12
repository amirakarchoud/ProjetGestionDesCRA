import { ActivityRule } from './ActivityRule';
import { Instant, ZoneId } from '@js-joda/core';
import { Interval } from '@js-joda/extra';
import { Raison } from './Raison';
import { Activity } from './Activity';
import { Absence } from './Absence';
import { AbsenceError } from '@app/domain/model/errors/absence.error';
import { ActivityError } from '@app/domain/model/errors/activity.error';

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
  ) {
    if (!(activity instanceof Absence)) {
      throw new ActivityError('Is not an absence');
    }
    const absDate = activity.date.atStartOfDay(ZoneId.systemDefault());
    const absInstant = Instant.from(absDate);

    if (activity.raison === Raison.Maladie) {
      const result = craInterval.contains(absInstant);
      if (!result) {
        throw new AbsenceError('Cannot add sick leave in the future');
      }
    } else {
      const result = !absInstant.isBefore(craInterval.start());
      if (!result) {
        throw new AbsenceError('Cannot add absence before the CRA interval');
      }
    }
  }
}
