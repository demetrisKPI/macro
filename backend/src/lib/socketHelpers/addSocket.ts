import { Socket } from 'socket.io';

const addSocket = (
	activeSockets: string[],
	socketId: string,
	socket: Socket,
) => {
	const existingSocket = activeSockets.find(
		(existingSocket) => existingSocket === socket.id,
	);

	if (existingSocket) return;

	activeSockets.push(socketId);

	socket.emit('update-user-list', {
		users: activeSockets.filter(
			(existingSocket) => existingSocket !== socketId,
		),
	});

	socket.broadcast.emit('update-user-list', {
		users: [socketId],
	});
};

export default addSocket;
