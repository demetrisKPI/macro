import { Socket } from 'socket.io';
import { CallUserEventData } from '../types';

type Props = {
	data: CallUserEventData;
	socket: Socket;
};

const handleCallUserEvent = ({ data, socket }: Props) => {
	socket.to(data.to).emit('call-made', {
		offer: data.offer,
		socket: socket.id,
	});
};

export default handleCallUserEvent;
