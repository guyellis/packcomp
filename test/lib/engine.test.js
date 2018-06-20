const { getContents } = require('../../lib/engine');

describe('cli', () => {
  test('should get contents', () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/',
        'test/fixtures/3/',
      ],
    };
    const contents = getContents(argv);
    expect(contents).toMatchSnapshot();
  });
});
