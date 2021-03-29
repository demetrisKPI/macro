import { Server } from 'socket.io';

type Props = {
	data: JSON;
	server: Server;
};

const handleMessageEvent = ({ data, server }: Props) => {
	console.log('[server](message): ', JSON.stringify(data));
	server.emit('message', data);
};

export default handleMessageEvent;
