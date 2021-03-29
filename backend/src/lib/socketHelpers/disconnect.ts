import { Socket } from 'socket.io';

const handleDisconnectEvent = (activeSockets: string[], socket: Socket) => {
	activeSockets = activeSockets.filter(
		(existingSocket) => existingSocket !== socket.id,
	);
	socket.broadcast.emit('remove-user', {
		socketId: socket.id,
	});
};

export default handleDisconnectEvent;
