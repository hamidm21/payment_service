const ZarinpalCheckout = require('zarinpal-checkout');
const util = require('util');
const log = require('debug')('payment_service:handler:zarin');

/**
 * Create ZarinPal
 * @param {String} `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` [Merchant ID]
 * @param {bool} false [toggle `Sandbox` mode]
 */
const zarinpal = ZarinpalCheckout.create('a1e3939a-6ae0-11e6-96c0-000c295eb8fc', false);


// pay request
exports.paymentRequest = function (Amount, CallbackURL, Description, Email, Mobile, callback) {

	/**
     * PaymentRequest [module]
     * @return {String} URL [Payment Authority]
     */
	zarinpal.PaymentRequest({
		Amount, //in Tomans
		CallbackURL,
		Description,
		Email,
		Mobile
	}).then(function (response) {
		if (response.status == 100) {
			log(response);
			callback(response);
		} else {
			callback(false);
			log(response);
		}
	}).catch(function (err) {
		log(err);
		callback(false);
	});
};


// verification request
exports.paymentVerification = function (Amount, Authority, callback) {

	zarinpal.PaymentVerification({
		Amount,//in Tomans
		Authority,
	}).then(function (response) {
		if (response.status == -21) {
			log('Empty!');
			callback(false);
		} else {
			log('Yohoooo! ' + util.inspect(response, false, null));
			callback(response.RefID);
		}
	}).catch(function (err) {
		log(err);
	});
};


// verification request
exports.paymentVerificationByAdmin = function (req, callback) {

	const {Amount, Authority} = req.body;

	zarinpal.PaymentVerification({
		Amount,//in Tomans
		Authority,
	}).then(function (response) {
		if (response.status == -21) {
			log('Empty!');
			callback(false);
		} else {
			log('Yohoooo! ' + util.inspect(response, false, null));
			callback(response.RefID);
		}
	}).catch(function (err) {
		log(err);
	});
};

// unverified transaction
exports.unverifiedTransaction = function (callback) {

	zarinpal.UnverifiedTransactions().then(function (response) {
		if (response.status == 100) {
			log(response.authorities);
			callback(response.authorities);
		}
	}).catch(function (err) {
		log(err);
	});
};

/*
zarinpal.RefreshAuthority({
    Authority: '000000000000000000000000000000000000',
    Expire: '1800'
}).then(function (response) {
    if (response.status == 100) {
        log(response.status);
    }
}).catch(function (err) {
    log(err);
});*/