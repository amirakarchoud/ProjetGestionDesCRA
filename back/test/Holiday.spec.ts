import { Holiday } from '@app/domain/model/Holiday';
import { LocalDate } from '@js-joda/core';

describe('Un jour ferie ', () => {
  it('ne peut pas avoir des attributs null', () => {
    expect(() => new Holiday(LocalDate.now(), null)).toThrowError(
      'cannot have a null attribute',
    );

    expect(() => new Holiday(null, 'name')).toThrowError(
      'cannot have a null attribute',
    );
  });
  it('peut avoir une date', () => {
    const date = LocalDate.now();
    const holiday = new Holiday(date, 'name');

    expect(holiday.date).toBe(date);
  });
  it('peut avoir un nom', () => {
    const date = LocalDate.now();
    const holiday = new Holiday(date, 'name');

    expect(holiday.name).toBe('name');
  });
  it('peut avoir un id', () => {
    const date = LocalDate.parse('2023-11-23');
    const holiday = new Holiday(date, 'name');

    expect(holiday.id).toBe('2023-11-23');
  });
});
