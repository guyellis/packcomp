const fetch = require('node-fetch');

const getRemotePackage = (url) => {
  const result = fetch(url);
  if (result.status > 299) {
    // eslint-disable-next-line no-console
    console.log(`Received unexpected status ${result.status} from call to ${url}`);
    return {};
  }

  return result.json();
};

module.exports = {
  getRemotePackage,
};
