const cli = require('../../lib/cli');

describe('cli', () => {
  test('should get dependencies', () => {
    const procArgv = [
      'node',
      'cli.js',
      '-f',
      'n*',
      'test/fixtures/1/',
      'test/fixtures/2/package.json',
      'test/fixtures/3/',
    ];

    global.console = {
      log: (arg) => {
        expect(arg).toMatchSnapshot();
      },
      table: (arg) => {
        expect(arg).toMatchSnapshot();
      },
    };

    cli(procArgv);

    expect.assertions(6);
  });

  test('should get help', () => {
    const procArgv = [
      'node',
      'cli.js',
      'help',
    ];

    global.console = {
      log: jest.fn(),
    };

    cli(procArgv);

    expect(global.console.log).toHaveBeenCalledTimes(1);
  });
});
