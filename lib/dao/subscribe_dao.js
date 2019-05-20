const db = require('../utils/db');
// const log = require('debug')('payment_service:mongo');

const SubscribeSchema = db.Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	euro_price: {
		type: Number,
		required: true
	},
	days: {
		type: Number,
		required: true
	},
	features: {
		type: [String],
		required: true
	},
	off: {
		type: Number,
		min: [0, 'off should be between 0 and 100 percent'],
		max: [100, 'off should be between 0 and 100 percent'],
		default: 0
	},
	label: {
		type: String,
		default: null
	},
	recommended: {
		type: Boolean,
		required: true,
		default: false
	}
});

SubscribeSchema.statics = {

	saveSubscribe: function (title, price, euro_price, days, features, off, label, recommended) {
		
		const Subscribe = new this({
			title,
			price, 
			euro_price,
			days, 
			features,
			off,
			label,
			recommended
		});

		return Subscribe.save();

	},

	getSubscribePrice: function (_id) {
		
		return this.findOne({_id});

	},
	getSubscribes: function () {
		
		return this.find({});
		
	}

};

exports.Subscribe = db.model('subscribe_model', SubscribeSchema);