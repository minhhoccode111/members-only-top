const mongoose = require('mongoose');

const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: {
    type: String,
    required: true,
    length: {
      min: 1,
    },
  },
  content: {
    type: String,
    required: true,
    length: {
      min: 1,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

MessageSchema.virtual('content_short').get(function () {
  if (this.content.length > 150) return this.content.slice(0, 148) + '...';
  return this.content;
});

MessageSchema.virtual('title_short').get(function () {
  if (this.title.length > 50) return this.title.slice(0, 48) + '...';
  return this.title;
});

MessageSchema.virtual('timestamp_formatted').get(function () {
  return DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.DATE_MED) + ' - ' + DateTime.fromJSDate(this.created_at).toLocaleString(DateTime.TIME_24_SIMPLE);
});

module.exports = mongoose.model('Message', MessageSchema);
