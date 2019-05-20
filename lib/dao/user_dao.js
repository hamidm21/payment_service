const db = require('../utils/db');
const jmoment = require('moment-jalaali');
const vresion = require('../../package.json').vresion;
// const log = require('debug')('payment_service:dao:transaction');

const UserSchema = db.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		default: 'User',
		enum: ['User', 'Psychologist', 'Secretary', 'Admin']
	},
	blocked: {
		type: Boolean,
		required: true,
		default: false
	},
	refreshToken: {
		type: String,
		unique: false
	},
	avatar: {
		type: String,
		required: true,
		default: 'http://www.goftare.com/profile.png'
	},
	email_notification: {
		type: Boolean,
		required: true,
		default: true
	},
	browser_notification: {
		type: Boolean,
		required: true,
		default: true
	},
	sms_notification: {
		type: Boolean,
		required: true,
		default: true
	},
	app_vresion: {
		type: String,
		default: vresion
	},
	os_type: {
		type: String,
	},
	device_details: {
		type: Object
	},
	offline_mode: {
		type: Boolean,
		required: true,
		default: false
	},
	country: {
		type: String,
		required: true,
		default: 'iran'
	},
	register_date: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jM/jD')
	},
	specific_information: {
		type: Object,
		required: true
	},
	moment: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD HH:mm:ss')
	},
});

UserSchema.statics = {

	findUserById: function (_id) {
		return this.findOne({
			_id
		}).lean();
		
	},
    
};


exports.User = db.model('user_model', UserSchema);