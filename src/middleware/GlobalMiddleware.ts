import { UserLogin } from '../models/UserLogin';

export class GlobalMiddleware{

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