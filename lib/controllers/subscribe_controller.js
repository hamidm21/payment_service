const log = require('debug')('payment_service:controller:subscribe');
const elog = require('debug')('payment_service:error:comtroller:subscribe');
const Subscribe = require('../dao/subscribe_dao').Subscribe;


exports.getSubscribes = async (req, res, next) => {
	try {
		const subscribes = await Subscribe.getSubscribes();
		res.json(Object.assign({}, req.base, {
			result: true,
			message: 'success',
			data: subscribes
		}));
	} catch (e) {
		elog({
			'error in get subscribes': e
		});
		next(new Error(e));
	}    
};