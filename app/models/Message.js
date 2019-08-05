const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    phone: { type: Number },
    message: { type: String },
    responded: { type: Boolean, default: false }
});

MessageSchema.plugin(timestamps);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
