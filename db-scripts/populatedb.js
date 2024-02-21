// add default data in database
const bcrypt = require('bcrypt');
require('dotenv').config(); // this line cause me 30 mins to debug

const User = require('./../src/models/user');
const Message = require('./../src/models/message');

// const custom = require('debug')('debug-custom');
const custom = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:FOgvsF1s5IS6siuj@cluster0.hvlxd0y.mongodb.net/?retryWrites=true&w=majority';

custom(mongoDB);

const users = [];
const messages = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const userCreate = async (index, fullname, username, password, member, admin) => {
  const userDetail = { fullname, username, password, member, admin };
  const user = new User(userDetail);
  await user.save();
  users[index] = user;
  custom(`adding: ${fullname} with _id: ${user._id}`);
};

const messageCreate = async (index, title, content, user) => {
  const messageDetail = {
    title,
    content,
    user,
  };
  const message = new Message(messageDetail);
  await message.save();
  messages[index] = message;
  custom(`adding ${title}`);
};

main().catch((err) => custom(err));

async function main() {
  custom('about to connect to database');
  await mongoose.connect(mongoDB);
  custom('about to insert some documents');
  await createUsers();
  await createMessages();
  custom('finishes insert documents');
  await mongoose.connection.close();
  custom('connection closed');
}

async function createUsers() {
  custom(process.env.USERS_PASSWORD);
  try {
    // why my editor says that we don't need await but will throw an error when don't have await? Is it because documents?
    const pw0 = await bcrypt.hash(process.env.USERS_PASSWORD, 10);
    const pw1 = await bcrypt.hash(process.env.USERS_PASSWORD, 10);
    const pw2 = await bcrypt.hash(process.env.USERS_PASSWORD, 10);
    const pw3 = await bcrypt.hash(process.env.USERS_PASSWORD, 10);

    await userCreate(0, 'Normal User', 'normaluser', pw0, false, false);
    await userCreate(1, 'Member User', 'memberuser', pw1, true, false);
    await userCreate(2, 'Admin User', 'adminuser', pw2, false, true);
    await userCreate(3, 'Full Flags User', 'fullflagsuser', pw3, true, true);

    const count = await User.countDocuments({}).exec();
    custom(`User models is having: ${count} documents`);
    custom(`Users passwords are: `, pw0, pw1, pw2, pw3);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function createMessages() {
  await messageCreate(0, 'Testing message 0', 'This message is created by normal user', users[0]);
  await messageCreate(0, 'Testing message 1', 'This message is created by normal user', users[0]);
  await messageCreate(0, 'Testing message 2', 'This message is created by member user', users[1]);
  await messageCreate(0, 'Testing message 3', 'This message is created by member user', users[1]);
  await messageCreate(0, 'Testing message 4', 'This message is created by admin user', users[2]);
  await messageCreate(0, 'Testing message 5', 'This message is created by admin user', users[2]);
  await messageCreate(0, 'Testing message 6', 'This message is created by full flags user', users[3]);
  await messageCreate(0, 'Testing message 7', 'This message is created by full flags user', users[3]);

  const count = await Message.countDocuments({}).exec();
  custom(`Message models is having: ${count} documents`);
}
