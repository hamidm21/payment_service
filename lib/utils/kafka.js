// const chat_controller = require('../controllers/chat_controller');
const config = require('../config/config');
const log = require('debug')('payment_service:utils:kafka');
const elog = require('debug')('payment_service:error:utils:kafka');
// const winston = require('./logger');
const kafka = require('kafka-node');
const Client = new kafka.KafkaClient({
	kafkaHost: config.KAFKA_HOST
});
const Producer = require('kafka-node').Producer;
const producer = new Producer(Client, config.PRODUCER_CONFIG);
const km = kafka.KeyedMessage;

producer.on('ready' , ()=> {
	log('kafka producer is up and running');
});

producer.on('error' , e => {
	elog(`kafka producer has errors -----> ${e}`);
});

exports.producer = producer;
exports.client = Client;
exports.km = km;
