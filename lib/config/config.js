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
	CONSUMER_CONFIG: {
		groupId: 'goftare_chat', //consumer group id, default `kafka-node-group`
		// Auto commit config
		autoCommit: true,
		autoCommitIntervalMs: 5000,
		// The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
		fetchMaxWaitMs: parseInt(process.env.FETCHMAXWAITMS),
		// This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
		fetchMinBytes: parseInt(process.env.FETCHMINBYTES),
		// The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
		fetchMaxBytes: parseInt(process.env.FETCHMAXBYTES),
		// If set true, consumer will fetch message from the given offset in the payloads
		fromOffset: true,
		// If set to 'buffer', values will be returned as raw buffer objects.
		encoding: process.env.ENCODING,
	}
};

module.exports = config;