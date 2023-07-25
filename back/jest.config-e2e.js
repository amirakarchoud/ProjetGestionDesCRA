// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config.js');

module.exports = {
  ...config,
  testRegex: '/test_e2e/.*\\.spec\\.ts$',
};
