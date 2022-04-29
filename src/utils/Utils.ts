import * as crypto from 'crypto';
import connection from '../config/database';
import * as Bcrypt from 'bcrypt';
import { UserLogin } from '../models/UserLogin';
import * as dateTime from 'node-datetime';

export class Utils{

    static getCurrentDateTime(){
        let dt = dateTime.create();
        let date = dt.format('Y-m-d H:M:S');
        return date;
    }

    static successResponse(response: any) {
        let responseArray = {
            status: 1,
            message: response.message,
            data: []
        };

        if (response.data != '') {
            responseArray.data = response.data;
        }
        return responseArray;
    }

    static errorResponse(response: any) {
        let responseArray = {
            status: 0,
            message: response.message,
        };
        return responseArray;
    }

    static async encryptPassword(password: string) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (err, encrypted) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(encrypted);
            });
        });
    }

    static comparePassword(planString: string, encryptedpassword: string) {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(planString, encryptedpassword, ((err, matched) => {
                if (err) {
                    reject(err);
                }

                resolve(matched);
            }));
        });
    }

    static async addAuthenticationToken(userId: number, fcmToken: string){
    	let token = Utils.generateToken(60);

        let userData = {
            user_id:userId,
            fcm_token:fcmToken,
            token:token
        }

    	await UserLogin.updateOrCreate(userData);
        return token;
    }

    static generateToken(len){
    	return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex')
        .slice(0,len);
    }

}