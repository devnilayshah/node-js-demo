import { validationResult } from 'express-validator';
import { UserLogin } from '../models/UserLogin';


export class GlobalMiddleware{

    static checkError(req: any, res: any, next: any) {
        const error = validationResult(req);  

        if (!error.isEmpty()) {
            next(new Error(error.array()[0].msg));
        } else {
            next();
        }
    }

	static async authenticate(req: any, res: any, next: any){
		const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
        try{
        	var userCheck = await UserLogin.checkUserToken(token);
        	if(userCheck == ''){
        		req.errorStatus = 401;
        		req.apiStatus = 0;
        		next(new Error('User not authorized'));
        	}else{
        		req.userData = userCheck[0];
        		next();
        	}
        }catch(e){
            next(e);
        }
        
	}
}