import { Holiday } from '@app/domain/model/Holiday';

describe('Un jour ferie ', () => {
  it('ne peut pas avoir des attributs null', () => {
    expect(() => new Holiday(null, new Date(), 'name')).toThrowError(
      'cannot have a null attribut',
    );

    expect(() => new Holiday(1, null, 'name')).toThrowError(
      'cannot have a null attribut',
    );
  });
  it('peut avoir une date', () => {
    const date = new Date();
    const holiday = new Holiday(1, date, 'name');

    expect(holiday.date).toBe(date);
  });
  it('peut avoir un nom', () => {
    const date = new Date();
    const holiday = new Holiday(1, date, 'name');

    expect(holiday.name).toBe('name');
  });
  it('peut avoir un id', () => {
    const date = new Date();
    const holiday = new Holiday(1, date, 'name');

    expect(holiday.id).toBe(1);
  });
});
