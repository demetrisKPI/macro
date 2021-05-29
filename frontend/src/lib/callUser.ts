import { Socket } from 'socket.io-client';

type Props = {
	socketId: string;
	socket?: Socket;
	peerConnection: RTCPeerConnection;
};

const callUser = async ({ socketId, socket, peerConnection }: Props) => {
	if (!socket) return;
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

	socket.emit('call-user', {
		offer,
		to: socketId,
	});
};

export default callUser;
