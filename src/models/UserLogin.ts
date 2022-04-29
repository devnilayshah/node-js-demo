import connection from '../config/database';
import { Utils } from '../utils/Utils';
const table = 'user_logins';

export class UserLogin{

	static async updateOrCreate(userData){		
    	let date = Utils.getCurrentDateTime();
    	var sql = "SELECT * FROM `"+table+"` WHERE `user_id` = "+userData.user_id;
    	var userLogin = await new Promise((resolve,reject)=>{
    		connection.query(sql,function(err, result){
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
    	});

    	if(userLogin == ''){
    		let data = {user_id:userData.user_id,fcm_token:userData.fcm_token,login_token:userData.token,created_at:date,updated_at:date,last_used_at:date};
    		var sql = "INSERT INTO `"+table+"` SET ?";
    		await new Promise((resolve, reject)=>{
    			connection.query(sql,data,function(err, result){
    				if (err) {
    					reject(err);
    				}
    				resolve(result);
    			});
    		});
    	}else{

    		let oldLoginId = userLogin[0].id;
    		let data = {fcm_token:userData.fcm_token,login_token:userData.token,updated_at:date,last_used_at:date};
    		var sql = "UPDATE `"+table+"` SET ? WHERE `id` ="+oldLoginId;
    		await new Promise((resolve, reject)=>{
    			connection.query(sql,data,function(err, result){
    				if (err) {
    					reject(err);
    				}
    				resolve(result);
    			});
    		});
    	}
	}


	static async checkUserToken(token: string){
		var sql = "SELECT users.* FROM `users` JOIN `"+table+"` ON `users`.`id` = `"+table+"`.`user_id` WHERE `login_token` = '"+token+"'";

		var userLoggedIn = await new Promise((resolve,reject)=>{
			connection.query(sql,function(err, result){
				if (err) {
					reject(err);
				}
				resolve(result);
			});
		});

		return userLoggedIn;
	}

}