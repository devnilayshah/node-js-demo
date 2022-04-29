import * as express from 'express';
import { Authentication } from './routers';


export class Server {
	
	public app: express.Application = express();
	

	constructor(){
		this.setConfiguration();
		this.setRoutes();
		this.error404Handler();
		this.handleErrors();
	}


	setConfiguration(){
		this.configureBodyParser();
	}

	configureBodyParser() {
		this.app.use(express.json()); 
		this.app.use(express.urlencoded({ extended: true }));
	}

	setRoutes(){
		this.app.use('/api/authentication',Authentication);
	}

	error404Handler() {
		this.app.use(function (req: any, res: any) {
			let resData = { status: 0, message: 'No Routes Found!' };
			res.status(404).json(resData);
		});
	}

	handleErrors() {
		this.app.use((error: any, req: any, res: any, next: any) => {
			const errorStatus = req.errorStatus || 500;
			const apiStatus = req.apiStatus || 0;

			res.status(errorStatus).json({
				status: apiStatus,
				message: error.message || 'Something went wrong!'
			});
		})
	}

}