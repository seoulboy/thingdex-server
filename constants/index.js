const localIPAddress = '192.168.0.47';
const localClientDomain = `http://${localIPAddress}:3000`;
const cloudClientDomain = `http://www.google.com`;
const domain =
  process.env_NODE_ENV === 'development'
    ? localClientDomain
    : cloudClientDomain;

module.exports = { domain };
