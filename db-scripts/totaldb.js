const User = require('./../src/models/user');
const Message = require('./../src/models/message');

// const debug = require('debug')('custom-debug');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:FOgvsF1s5IS6siuj@cluster0.hvlxd0y.mongodb.net/?retryWrites=true&w=majority';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug('some errors occur', err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  const userNum = await User.countDocuments({}).exec();
  const messageNum = await Message.countDocuments({}).exec();
  const users = await User.find({}).exec();
  const messages = await Message.find({}).exec();

  debug(`users belike: `, users);
  debug(`messages belike: `, messages);
  debug(`number of user currently in database: ${userNum}`);
  debug(`number of message currently in database: ${messageNum}`);
  debug('connected');
  debug('about to disconnect to database');
  await mongoose.connection.close();
}
