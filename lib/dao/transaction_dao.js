const db = require('../utils/db');
const moment = require('moment-jalaali');
// const log = require('debug')('payment_service:dao:transaction');

const TransactionSchema = db.Schema({

	authority: {
		type: String,
		required: true
	},
	payment_url: {
		type: String,
		required: true,
	},
	ref_id: {
		type: Number,
		default: 0
	},
	subscribe_id: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	psychologist_id: {
		type: String
	},
	room_id: {
		type: String
	},
	is_paid: {
		type: Boolean,
		required: true,
		default: false
	},
	date: {
		type: String,
		required: true,
		default: moment().format('jYYYY/jM/jD')
	},
	time_stamp: {
		type: Date,
		required: true,
	},
	moment: {
		type: String,
		required: true,
		default: moment().format('jYYYY/jMM/jDD HH:mm:ss')
	},
	secretary_id: {
		type: String,
		required: false,
	},
	secretary_room_id: {
		type: String,
		required: false
	},
	subscribe_title: {
		type: String,
		required: true,
	},
	subscribe_price: {
		type: Number,
		required: true,
		default: 0
	},
	euro_price: {
		type: Number,
		required: true,
		default: 0
	},
	is_foreign: {
		type: Boolean,
		required: true,
		default: false
	},
	is_free: {
		type: Boolean,
		required: true,
		default: false
	},
	is_returned: {
		type: Boolean,
		required: true,
		default: false
	},
	extended: {
		type: Boolean,
		default: true
	},
	expire_date: {
		type: String,
		default: ""
	},
	Origin: {
		type: String,
		enum: ['APP', 'WEB']
	},
	offset: {
		type: Number
	}

});

TransactionSchema.statics = {

	saveTransaction: function (authority, payment_url, subscribe_id, user_id, psychologist_id, room_id, subscribe_price, euro_price, extended, secretary_id, secretary_room_id,subscribe_title, Origin) {
		try {
			const transaction = new this({
				authority,
				payment_url,
				subscribe_id,
				user_id,
				psychologist_id,
				room_id,
				subscribe_price,
				euro_price,
				extended,
				secretary_id,
				secretary_room_id,
				subscribe_title,
				Origin,
				time_stamp: new Date().getTime()
			});
	
			return transaction.save();
		} catch (e) {
			return Promise.reject(e);
		}
	},
	findTransactionByAuthority: function (authority) {

		return this.findOne({
			authority
		});

	},
	updateTransaction: async function (authority, ref_id) {

		try {
			return this.updateOne({
				authority
			}, {
				$set: {
					is_paid: true,
					ref_id
				}
			});

		} catch (e) {
			Promise.reject(e);
		}
	},
	expireTransaction: async function (_id, offset) {

		try {
			return this.updateOne({
				_id
			}, {
				$set: {
					expire_date: moment().format('jYYYY/jMM/jDD HH:mm:ss'),
					offset
				}
			});

		} catch (e) {
			Promise.reject(e);
		}

	},
	getLastCommitedOffset: async function () {
		try {
			const lastMessageWithOffset = await this.find({})
				.sort({
					offset: -1
				}).limit(1);
			if (lastMessageWithOffset) {
				return Promise.resolve(lastMessageWithOffset[0].offset);
			}else 
				return Promise.resolve(1);
		} catch (e) {
			return Promise.reject(e);
		}
	}

};


exports.Transaction = db.model('transaction_model', TransactionSchema);