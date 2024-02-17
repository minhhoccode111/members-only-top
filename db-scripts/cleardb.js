// clear database
const User = require('./../src/models/user');
const Message = require('./../src/models/message');

// const debug = require('debug')('custom');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? 'mongodb+srv://minhhoccode111:FOgvsF1s5IS6siuj@cluster0.hvlxd0y.mongodb.net/?retryWrites=true&w=majority';

debug(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  debug('about to clear database');
  await clearMessage();
  await clearUser();
  debug('database cleared');
  debug('about to close connection');
  await mongoose.connection.close();
  debug('connection closed');
}

async function clearUser() {
  await User.deleteMany({}).exec();
  const count = await User.countDocuments({}).exec();
  debug(`User models is having: ${count} documents`);
  debug('Users cleared!');
}

async function clearMessage() {
  await Message.deleteMany({}).exec();
  const count = await Message.countDocuments({}).exec();
  debug(`Message models is having: ${count} documents`);
  debug('Messages cleared!');
}
