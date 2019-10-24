const localIPAddress = '192.168.0.47';
const localClientDomain = `http://${localIPAddress}:3000`;
const cloudClientDomain = `https://silly-agnesi-7a6e06.netlify.com`;
const domain =
  process.env_NODE_ENV === 'development'
    ? localClientDomain
    : cloudClientDomain;

module.exports = { domain };
