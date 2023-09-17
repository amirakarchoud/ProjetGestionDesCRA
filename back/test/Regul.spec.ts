import { Absence } from '@app/domain/model/Absence';
import { Raison } from '@app/domain/model/Raison';
import { Regul } from '@app/domain/model/Regul';
import { Action } from '@app/domain/model/action.enum';

describe('Regul ', () => {
  it('est creee correctement ', () => {
    //Given
    const date = new Date();
    const absence = new Absence('1', true, date, Raison.Conges);
    const regul = new Regul(date, Action.Add, absence);

    //Then
    expect(regul.date).toBe(date);
    expect(regul.action).toBe(Action.Add);
    expect(regul.target).toBe(absence);
  });
});
