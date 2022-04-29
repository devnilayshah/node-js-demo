import connection from '../config/database';
import { Utils } from '../utils/Utils';
const table = 'users';

export class User{

	static async createUser(userData){
		let date = Utils.getCurrentDateTime();
		let encryptedPassword = await Utils.encryptPassword(userData.password);
		
		let data = {
			first_name:userData.first_name,
			last_name:userData.last_name,
			email:userData.email,
			password:encryptedPassword,
			created_at:date,
			updated_at:date,
		}
		
		var sql = "INSERT INTO `"+table+"` SET ?";
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