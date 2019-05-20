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
		type: String,
		default: ''
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
		default: new Date().getTime()
	},
	moment: {
		type: String,
		required: true,
		default: moment().format('jYYYY/jMM/jDD HH:mm')
	},
	secretary_id: {
		type: String,
		required: true,
	},
	secretary_room_id: {
		type: String,
		required: true
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
				Origin
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
	updateTransactionAfterVarification: async function (_id, is_paid, ref_id) {

		try {
			return this.findOneAndUpdate({
				_id
			}, {
				$set: {
					is_paid,
					ref_id
				}
			});

		} catch (e) {

			Promise.reject(e);
		
		}
	},
	expireTransaction: async function (_id, user_id) {

		try {
			return this.updateOne({
				_id
			}, {
				$set: {
					expire_date: jmoment().format('jYYYY/jMM/jDD HH:mm:ss')
				}
			});

		} catch (e) {
			Promise.reject(e);
		}

	}

};


exports.Transaction = db.model('transaction_model', TransactionSchema);