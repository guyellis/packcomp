const {
  getContents,
  getTitles,
  getFilter,
} = require('../../lib/engine');

describe('cli', () => {
  test('should get contents', () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'test/fixtures/3/',
      ],
    };
    const contents = getContents(argv);
    expect(contents).toMatchSnapshot();
  });

  test('should get titles', () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'test/fixtures/3/',
      ],
    };
    const contents = getTitles(argv);
    expect(contents).toMatchSnapshot();
  });

  test('should get * for no filter', () => {
    const filter = getFilter({});
    expect(filter).toBe('*');
  });

  test('should get string for filter', () => {
    const filter = getFilter({ f: 'xyz' });
    expect(filter).toBe('xyz');
  });
});
