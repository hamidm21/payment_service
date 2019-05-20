const
	Transaction = require('./Transaction'),
	Subscribe = require('./Subscribe');

module.exports = app => {
	app.use('/Transaction', Transaction);
	app.use('/Subscribe', Subscribe);
};