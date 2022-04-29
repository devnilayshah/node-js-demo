import { Server } from './server';


let server = new Server().app;
let port = 9635;

server.listen(port, function(){
	console.log('Server is started....');
})