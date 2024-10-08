const log = require('debug')('payment_service:controller:transaction');
const elog = require('debug')('payment_service:error:comtroller:transaction');
const kafka = require('../handlers/kafka_handler');
const User = require('../dao/user_dao').User;
const Message = require('../dao/chat_dao').Message;
const Transaction = require('../dao/transaction_dao').Transaction;
const Subscribe = require('../dao/subscribe_dao').Subscribe;
const Room = require('../dao/room_dao').Room;
const config = require('../config/config');
const zarin = require('../handlers/zarinpal_handler');
const validator = require('../utils/validator');


exports.payment = async (req, res, next) => {
	const {
		subscribe_id,
		user_id,
		psychologist_id,
		room_id,
		secretary_room_id,
		secretary_id,
		extended,
		Origin
	} = req.body;
	try {
		const valid = validator.joi.validate(req.body, validator.payment);
		if (valid.error) {
			log(valid.error);
			res.status(406).json(Object.assign({}, req.base, {
				result: false,
				message: 'input is not valid',
				data: valid.error
			}));
		} else {
			const subscribe = await Subscribe.getSubscribePrice(subscribe_id);
			const price = subscribe.off !== 0 ? (subscribe.price - (subscribe.price * subscribe.off) / 100) : subscribe.price;
			const euro_price = subscribe.off !== 0 ? (subscribe.euro_price - (subscribe.euro_price * subscribe.off) / 100) : subscribe.euro_price;
			zarin.paymentRequest(price, config.ZARIN_CALLBACK_URL, subscribe.title, '', '', async function (result) {
				log({
					'payment request result': result
				});
				const transaction = await Transaction.saveTransaction(result.authority, result.url, subscribe_id, user_id, psychologist_id, room_id, price, euro_price, extended, secretary_id, secretary_room_id, subscribe.title, Origin);
				res.json(Object.assign({}, req.base, {
					result: true,
					message: 'success',
					data: {
						url: result.url,
						transaction_id: transaction._id
					}
				}));
			});
		}
	} catch (e) {
		elog({
			'error in payment request': e
		});
		next(new Error(e));
	}
};


exports.paymentVerification = async (req, res, next) => {
	const {
		Status,
		Authority
	} = req.query;
	try {
		log({
			'queries ': req.query,
			'path': req.path
		});
		const transaction = await Transaction.findTransactionByAuthority(Authority);
		if (Status == 'OK') {
			log({
				transaction
			});
			zarin.paymentVerification(transaction.subscribe_price, Authority, function (ref_id) {
				if (ref_id) {
					Transaction.updateTransaction(transaction.id, true, ref_id).then(updated_transaction => {
						log({updated_transaction});
						User.findUserById(transaction.user_id).then(user => {
							log({user})
							User.findUserById(transaction.psychologist_id).then(psychologist => {
								log({psychologist})
								Room.updateRoomAfterVerification(transaction.room_id, transaction.user_id, transaction._id).then(room => {
									log({room})
									if (!transaction.extended) {
										Room.deactivateRoom(transaction.secretary_room_id).then(deactivated_room => {
										log({deactivated_room})
										kafka.transactionSms(psychologist.specific_info.phone_number, 'goftarebuysubscribe1', user.username, 'خرید', transaction.subscribe_title).then(sms => {
											log({sms})
											res.send(`/payment/success/${Authority}`);
										});	
									});
									} else {
										kafka.transactionSms(psychologist.specific_info.phone_number, 'goftarebuysubscribe1', user.username, 'نمدید', transaction.subscribe_title).then(sms => {
											log({sms})
											res.send(`/payment/success/${Authority}`);
										});
									}
								});
							});
						});
					});
					//TODO: update the current room is paid 
				} else {
					Message.deleteMany({room_id: transaction.room_id}).then(result => {
						Room.deleteOne({_id: transaction.room_id}).then(result => {
							res.send(`/payment/failed/${Authority}`);
						});
					});
				}
			});
		} else{
			Message.deleteMany({room_id: transaction.room_id}).then(result => {
				Room.deleteOne({_id: transaction.room_id}).then(result => {
					res.send(`/payment/failed/${Authority}`);
				});
			});
		}
	} catch (e) {
		elog({
			'error in payment varification': e
		});
		next(new Error(e));
	}
};

exports.paymentCheck = async (req, res, next) => {
	const {
		Authority,
		transaction_id
	} = req.body;
	try {
		log({'req': req.body});
		const transaction = await Transaction.findOne({$or:[
			{
				_id: transaction_id	
			},
			{
				authority: Authority
			}
		]});
		// log({transaction});
		const psychologist = await User.findById({
			_id: transaction.psychologist_id
		}, {
			username: 1
		});
		// log({
		// 	transaction
		// });
		res.json(Object.assign({}, req.base, {
			message: 'success',
			data: {
				Authority,
				price: transaction.subscribe_price,
				type: transaction.subscribe_title,
				psychologist_username: psychologist.username,
				Origin: transaction.Origin,
				is_paid: transaction.is_paid
			}
		}));
	} catch (e) {
		next(new Error(e));
	}
};

exports.expireTransaction = async message => {
	const msg = JSON.parse(message.value);
	try {
		const valid = validator.joi.validate(msg, validator.expireTransaction);
		if (valid.error) {
			// winston.error('validation failed for expireTransaction');
		} else {
			const room_updated = await Room.expireTransaction(msg.room_id, msg.user_id);
			log({room_updated})
			const transaction_updated = await Transaction.expireTransaction(room_updated.transaction_id, message.highWaterOffset);
			log({
				'expireTransaction result': true,
				room_updated,
				transaction_updated
			});
		}
	} catch (e) {
		// winston.error('error in expireTransaction controller');
	}
};