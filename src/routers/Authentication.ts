import { Router } from "express";
import { LoginController } from '../controllers/LoginController'
import { GlobalMiddleware } from '../middleware/GlobalMiddleware';

class Authentication {
	public router: Router;

	constructor(){
		this.router = Router();
		this.getRoutes();
		this.postRoutes();
	}

	getRoutes(){
		this.router.get('/dashboard',GlobalMiddleware.authenticate,LoginController.dashboard);
		this.router.get('/logout',GlobalMiddleware.authenticate,LoginController.logoutUser);
	}

	postRoutes(){
		this.router.post('/register',LoginController.registerUser);
		this.router.post('/login',LoginController.loginUser);
	}
}


export default new Authentication().router;