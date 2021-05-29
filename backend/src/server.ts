import express, { Application } from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';

import path from 'path';
import cors from 'cors';
import {
	addSocket,
	handleMessageEvent,
	handleCallUserEvent,
	handleMakeAnswerEvent,
	handleDisconnectEvent,
} from './lib/socketHelpers';
import { CallUserEventData } from './lib/types';

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

	private handleSocketEvents(socket: Socket): void {
		socket.on('message', (data: JSON) =>
			handleMessageEvent({ data, server: this.io }),
		);

		socket.on('call-user', (data: CallUserEventData) =>
			handleCallUserEvent({ data, socket }),
		);

		socket.on('make-answer', (data: CallUserEventData) =>
			handleMakeAnswerEvent({ data, socket }),
		);

		socket.on('disconnect', () => {
			console.log('disconnect');

			this.activeSockets = handleDisconnectEvent(this.activeSockets, socket);
		});
	}

	private handleSocketConnection(): void {
		this.io.on('connection', (socket: Socket) => {
			if (this.activeSockets.length >= 2) return;
			addSocket(this.activeSockets, socket.id, socket);

			this.handleSocketEvents(socket);
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
