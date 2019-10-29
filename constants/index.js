const localIPAddress = '192.168.0.57';
const localClientDomain = `http://${localIPAddress}:3000`;
const cloudClientDomain = `https://wwww.thingdex.space`;

const localServerDomain = `http://${localIPAddress}:4000`;
const cloudServerDomain = 'https://api.thingdex.space';

const serverDomain =
  process.env.NODE_ENV === 'development'
    ? localServerDomain
    : cloudServerDomain;

const domain =
  process.env.NODE_ENV === 'development'
    ? localClientDomain
    : cloudClientDomain;

module.exports = { domain, serverDomain };
