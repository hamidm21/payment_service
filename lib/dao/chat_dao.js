const mongo = require('../utils/db');
const jmoment = require('moment-jalaali');
const mongo_log = require('debug')('api:chamar');


const MessageSchema = mongo.Schema({
	incremental_id: {
		type: Number,
		required: true,
	},
	moment: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD HH:mm:ss')
	},
	midnight_msg: {
		type: Boolean,
		required: true,
		default: false
	},
	psychologist_id: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	room_id: {
		type: String,
		required: true
	},
	room: {
		type : mongo.Types.ObjectId,
		ref: 'room_model'
	},
	sender_id: {
		type: String,
		required: true
	},
	creator_id: {
		type: String,
		required: true
	},
	sender_avatar: {
		type: String
	},
	type: {
		type: String,
		required: true,
		enum: ['text', 'voice', 'image', 'file', 'notify'],
		default: 'text'
	},
	content: {
		type: String
	},
	timestamp: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	is_read: {
		type: Number,
		required: true,
		default: 1,
		enum: [0, 1, 2]
	},
	is_deleted: {
		type: Number,
		default: 0,
		enum: [0, 1]
	},
	offset: {
		type: Number,
		required: true,
		default: 1
	}
});


exports.Message = mongo.model('message_model', MessageSchema);
