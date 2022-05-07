import connection from '../config/database';
import { Utils } from '../utils/Utils';
import { User } from '../models/User';

export class LoginController{

	static transform(responseData){
		const transformed = {};
		transformed['id'] = responseData['id'];
		transformed['first_name'] = responseData['first_name'];
		transformed['last_name'] = responseData['last_name'];
		transformed['country_id'] = responseData['country_id'];

		return transformed;
	}


	/** Register user into system **/
	static async registerUser(req: any, res: any, next: any){
		try{

			let userData = req.body;
			await User.createUser(userData);

			let response = {
				message:'User registered successfully',
			};

			res.status(200).json(Utils.successResponse(response));

		}catch(e){
			next(e);
			return;
		}
	}

	/** Login into system **/
	static async loginUser(req: any, res: any, next: any){
		
		try{

			let email = req.body.email;
			let password = req.body.password;
			let fcmToken = req.body.fcm_token;
			let sql = "SELECT id,email,first_name,last_name,password FROM `users` WHERE `email` = '"+email+"' LIMIT 1";

			let user = await new Promise((resolve, reject)=>{
                connection.query(sql,function(err, result){
                	if (err) {
                		reject(err);
                	}
                	resolve(result);
                });
			});

			if(user != ''){

				let passCompare = user[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
				delete user[0]['password'];
				let passwordMatched = await Utils.comparePassword(password, passCompare);
				if(passwordMatched){
					var token = await Utils.addAuthenticationToken(user[0].id,fcmToken);
					
					let data = {
						user:user[0],
						token:token
					}
					
					let response = {
						message:'Logged in successfully',
						data:data
					};

					res.status(200).json(Utils.successResponse(response));
				}else{
					let response = {
						message:'Username or password is incorrect',
					};
					res.status(200).json(Utils.errorResponse(response));
				}
				

			}else{

				let response = {
					message:'Username or password is incorrect',
				};
				res.status(200).json(Utils.errorResponse(response));
			}

		}catch(e){
			next(e);
			return;
		}
	}


	/** Logout function **/
	static async logoutUser(req: any, res: any, next: any){
		try{

			let date = Utils.getCurrentDateTime();
			let data = {login_token:null,fcm_token:null,updated_at:date}
			
			let sql = "UPDATE `user_logins` SET ? WHERE `user_id` = "+req.userData.id;
			
			let logout = await new Promise((resolve,reject) => {
				connection.query(sql,data,(err, result) => {
					if(err){
						reject(err);
					}

					resolve(result);
				});
			});

			let response = {
				message:'User logged out successfully',
			};

			res.status(200).json(Utils.successResponse(response));

		}catch(e){
			next(e);
			return;
		}
	}


	/** Dashboard **/
	static async dashboard(req: any, res: any, next: any){
		try{

			let response = {
				message:'Data fetched successfully',
			};

			res.status(200).json(Utils.successResponse(response));

		}catch(e){
			next(e);
			return;
		}
	}

}