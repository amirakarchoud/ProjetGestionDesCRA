import { Interval } from '@js-joda/extra';
import { Activity } from './Activity';

export interface ActivityRule {
  validateRule(
    activity: Activity,
    craInterval: Interval,
    closureInterval: Interval,
  ): boolean;
}
