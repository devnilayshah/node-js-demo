import { body } from 'express-validator';
import { User } from '../models/User';

export class AuthenticationValidator {

	static signUp() {
		return [
			body('first_name', 'Firstname is required').isString().notEmpty(),
			body('last_name', 'Lastname is required').isString().notEmpty(),
			body('email', 'A valid email is required').isEmail().notEmpty().custom(async (email, { req })=>{
				let userCheck = await User.checkEmailId(email);
				if(userCheck == 1){
					throw new Error("Email id already exists in database!");
				}
				return true;
			}),
			body('password','A valid password is required').isAlphanumeric().isLength({ min: 8, max: 20 }).withMessage('Password can be between 8-20 characters'),
		];
	}

	static login() {
		return [
			body('email','A valid email is required').isEmail().notEmpty(),
			body('password','A valid password is required').isLength({ min: 8, max: 20 }).withMessage('Password can be between 8-20 characters'),
			body('fcm_token','FCM token is required').notEmpty()
		];
	}
}