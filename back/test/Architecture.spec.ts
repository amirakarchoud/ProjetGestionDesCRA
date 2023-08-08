import 'tsarch/dist/jest';
import { filesOfProject } from 'tsarch';

describe('architecture', () => {
  jest.setTimeout(60000);

  it('business logic should be cycle free', async () => {
    const rule = filesOfProject().inFolder('model').should().beFreeOfCycles();

    await expect(rule).toPassAsync();
  });

  it('business logic should not depend on the data layer', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('data');

    await expect(rule).toPassAsync();
  });

  it('business logic should not depend on the controllers', async () => {
    const rule = filesOfProject()
      .inFolder('domain')
      .shouldNot()
      .dependOnFiles()
      .inFolder('controllers');

    await expect(rule).toPassAsync();
  });

  it('controllers should not depend on the data layer', async () => {
    const rule = filesOfProject()
      .inFolder('controllers')
      .shouldNot()
      .dependOnFiles()
      .inFolder('data');

    await expect(rule).toPassAsync();
  });

  it('data layer should not depend on controllers', async () => {
    const rule = filesOfProject()
      .inFolder('data')
      .shouldNot()
      .dependOnFiles()
      .inFolder('controllers');

    await expect(rule).toPassAsync();
  });

  it('naming Repositories', async () => {
    const violations = await filesOfProject()
      .inFolder('data/Repository')
      .should()
      .matchPattern('.*Repository.ts')
      .check();
    expect(violations).toEqual([]);
  });

  it('naming in data model', async () => {
    const violations = await filesOfProject()
      .inFolder('data/dataModel')
      .should()
      .matchPattern('.*entity.ts|.*Info.ts')
      .check();
    expect(violations).toEqual([]);
  });

  it('naming controllers', async () => {
    const violations = await filesOfProject()
      .inFolder('controllers')
      .should()
      .matchPattern('.*controller.ts')
      .check();
    expect(violations).toEqual([]);
  });

  it('naming tests', async () => {
    const violations = await filesOfProject()
      .inFolder('tests')
      .should()
      .matchPattern('.*spec.ts')
      .check();
    expect(violations).toEqual([]);
  });

  it('naming services', async () => {
    const violations = await filesOfProject()
      .inFolder('domain/service')
      .should()
      .matchPattern('.*service.ts')
      .check();
    expect(violations).toEqual([]);
  });
});
