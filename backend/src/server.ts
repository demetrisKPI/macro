// @ts-ignore
import express, { Application } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';

import path from 'path';
import cors from 'cors';

export class Server {
	private httpServer: HTTPServer;
	private app: Application;
	private io: SocketIOServer;

	private readonly DEFAULT_PORT = 5000;
	private activeSockets: string[] = [];

	constructor() {
		this.initialize();

		this.handleRoutes();
		this.handleSocketConnection();
	}

	private initialize(): void {
		this.app = express();
		this.httpServer = createServer(this.app);
		this.io = new SocketIOServer(this.httpServer, {
			cors: {
				origin: '*',
			},
		});

		this.configureApp();
	}

	private handleRoutes(): void {
		this.app.get('/', (req, res) => {
			res.send(`<h1>Hello World</h1>`);
		});
	}

	private handleSocketConnection(): void {
		this.io.on('connection', (socket: Socket) => {
			console.log('connected', socket.id);

			const existingSocket = this.activeSockets.find(
				(existingSocket) => existingSocket === socket.id,
			);

			if (!existingSocket) {
				this.activeSockets.push(socket.id);

				socket.emit('update-user-list', {
					users: this.activeSockets.filter(
						(existingSocket) => existingSocket !== socket.id,
					),
				});

				socket.broadcast.emit('update-user-list', {
					users: [socket.id],
				});
			}

			socket.on('message', (m: any) => {
				console.log('[server](message): ', JSON.stringify(m));
				this.io.emit('message', m);
			});

			socket.on('disconnect', () => {
				this.activeSockets = this.activeSockets.filter(
					(existingSocket) => existingSocket !== socket.id,
				);
				socket.broadcast.emit('remove-user', {
					socketId: socket.id,
				});
			});
		});
	}

	private configureApp(): void {
		this.app.use(express.static(path.join(__dirname, '../public')));
		this.app.use(cors({ origin: '*' }));
	}

	public listen(callback: (port: number) => void): void {
		this.httpServer.listen(this.DEFAULT_PORT, () =>
			callback(this.DEFAULT_PORT),
		);
	}
}
