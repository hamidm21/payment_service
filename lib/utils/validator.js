const joi = require('joi');


exports.payment = joi.object().keys({
	room_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	secretary_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	secretary_room_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	subscribe_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	psychologist_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	user_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	extended: joi.bool().required(),
	Origin: joi.string().only('APP', 'WEB').required()
});

exports.expireTransaction = joi.object().keys({
	room_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
	user_id: joi.string().required().regex(/^[a-f\d]{24}$/i),
});

exports.joi = joi;