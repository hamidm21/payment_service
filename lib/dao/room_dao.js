const db = require('../utils/db');
const jmoment = require('moment-jalaali');
const log = require('debug')('payment_service:dao:room');

const RoomSchema = db.Schema({

	moment: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jMM/jDD HH:mm:ss')
	},
	psychologist_id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		default: 'group_default_name',
		required: true
	},
	creator_id: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
		default: 'http://goftare.com/group-profile.png'
	},
	type: {
		type: String,
		required: true,
		enum: ['P2P', 'GROUP'],
		default: 'P2P'
	},
	state: {
		type: String,
		required: true,
		enum: ['OPEN', 'CLOSED', 'EXPIRED'],
		default: 'OPEN'
	},
	owner_id: {
		type: String,
		required: true,
	},
	user_id: {
		type: String,
		required: true
	},
	members: {
		type: [Object],
		required: true,
	},
	transaction_id: {
		type: String,
		default: ''
	},
	is_active: {
		type: Boolean,
		required: true,
		default: false
	},
	subscribe_state: {
		type: String,
		required: true,
		default: 'try',
		enum: ['try', 'tryFinished', 'subscribed', 'expired']
	},
	is_paid: {
		type: Boolean,
		default: false
	},
	expire_dates: {
		type: [String]
	},
	date: {
		type: String,
		required: true,
		default: jmoment().format('jYYYY/jM/jD')
	},
	time: {
		type: String,
		required: true,
		default: jmoment().format('HH:mm')
	},
	is_new: {
		type: Boolean,
		default: true
	}

});


RoomSchema.statics = {

	updateRoomAfterVerification: function (_id, user_id, transaction_id) {
		try {
			return this.updateOne({
				_id,
			},{
				$set: {
					transaction_id, 
					is_paid: true,
					is_active: true,
					state: 'OPEN',
					'members.1.state': 'subscribed'
				}
			});
		} catch (e) {
			return Promise.reject(e);
		}
	},
	deactivateRoom: function (_id) {
		try {
			return this.updateOne({
				_id
			}, {
				$set: {
					state: 'CLOSED',
					is_active: false,
				}
			});
		} catch (e) {
			return Promise.reject(e);
		}
	},
	expireTransaction: async function (_id, user_id) {
		log(_id)
		try {
			await this.updateOne({
				_id
			}, {
				$set: {
					state: 'EXPIRED',
					is_paid: false,
				},
				$push: {
					expire_dates: jmoment().format('jYYYY/jMM/jDD HH:mm:ss')
				}
			});

			await this.updateOne({
				_id,
				'members.user_id': user_id
			}, {
				$set: {
					'members.$.state': 'expired'
				}
			});
			return this.findOne({_id});
		} catch (e) {
			Promise.reject(e);
		}

	}

};


exports.Room = db.model('room_model', RoomSchema);