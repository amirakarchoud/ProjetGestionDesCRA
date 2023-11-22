import { LocalDate } from '@js-joda/core';

export const dateMonthsEqual = (date1: LocalDate, date2: LocalDate) => {
  return date1.month() === date2.month() && date1.year() === date2.year();
};

export const isWeekend = (date: LocalDate): boolean => {
  const dayOfWeek = date.dayOfWeek();
  return dayOfWeek.value() >= 6;
};
