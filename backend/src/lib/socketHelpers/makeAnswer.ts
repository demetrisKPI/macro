import { Socket } from 'socket.io';
import { CallUserEventData } from '../types';

type Props = {
	data: CallUserEventData;
	socket: Socket;
};

const handleMakeAnswerEvent = ({ data, socket }: Props) => {
	socket.to(data.to).emit('answer-made', {
		socket: socket.id,
		answer: data.answer,
	});
};

export default handleMakeAnswerEvent;
