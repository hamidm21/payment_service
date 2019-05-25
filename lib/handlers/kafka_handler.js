const client = require('../utils/kafka').client;
const producer = require('../utils/kafka').producer;
const km = require('kafka-node').KeyedMessage;
const Consumer = require('kafka-node').Consumer;
const config = require('../config/config');
const Transaction = require('../dao/transaction_dao').Transaction; 
const transaction = require('../controllers/transaction_controller');
const log = require('debug')('payment_service:handler:kafka');
const elog = require('debug')('payment_service:error:handler:kafka');


exports.kafkaInit = async () => {
	const lastOffset = await Transaction.getLastCommitedOffset();
	log(lastOffset);
	const consumer = new Consumer(client, [Object.assign({}, config.PAYLOADS, {
		offset: lastOffset
	})], config.CONSUMER_CONFIG);
	consumer.on('message', message => {
		log(message);
		switch (message.key) {
		case 'expireTransaction':
			transaction.expireTransaction(message);
			break;
		default:
			break;
		}
	});
};


exports.transactionSms = async (phone_number, template, username, type, subscribe_title) => {
	try {
		const keyedMessage = new km('transactionSms', JSON.stringify({phone_number, template, username, type, subscribe_title}));
		producer.send([Object.assign({}, config.PAYLOAD, {
			messages: [keyedMessage]
		})], function (err, result) {
			if (err) {
				elog({
					'error in transactionSms producer': err
				});
				Promise.reject(err);
			} else {
				log({
					'transactionSms producer result': result
				});
				Promise.resolve(result);
			}
		});
	} catch (e) {
		elog({
			'error in transactionSms producer': e
		});
		Promise.reject(e);
	}
};
