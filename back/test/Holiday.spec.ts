import { Holiday } from '@app/domain/model/Holiday';

describe('Un jour ferie ', () => {
  it('ne peut pas avoir des attributs null', () => {
    expect(() => new Holiday(new Date(), null)).toThrowError(
      'cannot have a null attribute',
    );

    expect(() => new Holiday(null, 'name')).toThrowError(
      'cannot have a null attribute',
    );
  });
  it('peut avoir une date', () => {
    const date = new Date();
    const holiday = new Holiday(date, 'name');

    expect(holiday.date).toBe(date);
  });
  it('peut avoir un nom', () => {
    const date = new Date();
    const holiday = new Holiday(date, 'name');

    expect(holiday.name).toBe('name');
  });
  it('peut avoir un id', () => {
    const date = new Date('2023-11-23');
    const holiday = new Holiday(date, 'name');

    expect(holiday.id).toBe('23/11/2023');
  });
});
