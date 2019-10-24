const DB_NAME = 'thingdex';
module.exports = {
  mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-rlera.mongodb.net/thingdex?retryWrites=true&w=majority`,
  google: {
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
  },
};
