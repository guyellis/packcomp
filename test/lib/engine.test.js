const fetch = require('node-fetch');

jest.mock('node-fetch');

const {
  getContents,
  getFilter,
  getDependencies,
} = require('../../lib/engine');

const packageFixture3 = require('../fixtures/3/package.json');

describe('engine', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('should get contents', async () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'test/fixtures/3/',
      ],
    };
    const contents = await getContents(argv);
    expect(contents).toMatchSnapshot();
  });

  test('should get dependencies', async () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'test/fixtures/3/',
      ],
    };
    const contents = await getDependencies(argv);
    expect(contents).toMatchSnapshot();
  });

  test('should get pivoted dependencies', async () => {
    const argv = {
      p: true,
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'test/fixtures/3/',
      ],
    };
    const contents = await getDependencies(argv);
    expect(contents).toMatchSnapshot();
  });

  test('should get dependencies with URLs', async () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'https://some-domain.com/some-package.json',
      ],
    };

    const resp = { status: 200, json: () => Promise.resolve(packageFixture3) };
    fetch.mockResolvedValue(resp);

    const contents = await getDependencies(argv);
    expect(contents).toMatchSnapshot();
  });

  test('should handle fetch errors with URLs', async () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/2/package.json',
        'https://some-domain.com/some-package.json',
      ],
    };

    global.console = {
      error: jest.fn(),
    };

    const resp = { status: 404 };
    fetch.mockResolvedValue(resp);

    const contents = await getDependencies(argv);
    expect(contents).toMatchSnapshot();
    expect(global.console.error).toHaveBeenCalledTimes(1);
  });

  test('should work when dependencies are identical', async () => {
    const argv = {
      _: [
        'test/fixtures/1/',
        'test/fixtures/1/package.json',
        'test/fixtures/1/',
      ],
    };
    const contents = await getDependencies(argv);
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
