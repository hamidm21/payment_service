require ('dotenv').config();

const config = {
	PORT: process.env.PORT,
	MONGO_HOST: process.env.MONGO_HOST,
	KAFKA_HOST: process.env.KAFKA_HOST,
	ZARIN_CALLBACK_URL: process.env.ZARIN_CALLBACK_URL,
	PRODUCER_CONFIG: {
		requireAcks: parseInt(process.env.REQUIREACKS),
		ackTimeoutMs: parseInt(process.env.ACKTIMEOUTMS),
		partitionerType: parseInt(process.env.PARTITIONERTYPE)
	},
	PAYLOAD: {
		topic: process.env.NOTIFY_TOPIC,
		messages: [], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
		key: 'message', // string or buffer, only needed when using keyed partitioner
		partition: 0, // default 0
		attributes: 1, // default: 0
		timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
	},
	PAYLOADS: {
		topic: process.env.PAY_TOPIC,
		offset: 857, //default 0
		partition: parseInt(process.env.PARTITION) // default 0
	},
};

module.exports = config;