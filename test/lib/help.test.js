const help = require('../../lib/help');

describe('help', () => {
  test('should print help', () => {
    global.console = {
      log: jest.fn(),
    };
    help();
    expect(global.console.log).toHaveBeenCalled();
  });
});
