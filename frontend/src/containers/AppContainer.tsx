import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from 'src/common/types';
import App from '../components/App';
import callUser from '../lib/callUser';

const { RTCPeerConnection, RTCSessionDescription } = window;

const constraints: MediaStreamConstraints = {
	video: {
		width: 1366,
		height: 768,
	},
	audio: true,
};

const AppContainer = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const [socketState, setSocketState] = useState<Socket>();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isBeingCalled, setIsBeingCalled] = useState<boolean>(false);
	const [, setRerender] = useState(false);
	const [connection, setConnection] = useState<RTCPeerConnection>();
	const [userList, setUserList] = useState<string[]>([]);
	const [callOffer, setCallOffer] = useState<any>();
	const [remoteUser, setRemoteUser] = useState<string>('');

	const [isAlreadyCalling, setIsAlreadyCalling] = useState(false);

	useEffect(() => {
		const peerConnection = new RTCPeerConnection();
		const socket = io('http://localhost:5000');

		setConnection(peerConnection);
		setSocketState(socket);
	}, []);

	useEffect(() => {
		if (!socketState || !connection) return;

		connection.ontrack = ({ streams: [stream] }) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = stream;
			}
		};

		socketState.on('message', (data) => {
			const newMessages = messages;

			newMessages.unshift(JSON.parse(data).data);
			setRerender((state) => !state);
			setMessages(newMessages);
		});

		socketState.on('disconnected', () => {
			setSocketState({} as Socket);
		});

		navigator.mediaDevices
			?.getUserMedia(constraints)
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
				stream
					.getTracks()
					.forEach((track) => connection.addTrack(track, stream));
			})
			.catch((err) => {
				console.error(err);
			});

		socketState.on('update-user-list', ({ users }: { users: string[] }) => {
			setUserList(users);
		});

		socketState.on('call-made', async (data) => {
			await setIsBeingCalled(true);
			await setCallOffer(data);
			setRerender((state) => !state);
		});

		socketState.on('answer-made', async (data) => {
			if (isAlreadyCalling) return;

			await connection
				.setRemoteDescription(new RTCSessionDescription(data.answer))
				.then(() => setRemoteUser(data.socket))
				.catch((err) => console.log(err));

			// if (!isAlreadyCalling) {
			// 	await callUser({
			// 		socketId: data.socket,
			// 		socket: socketState,
			// 		peerConnection: connection,
			// 	});
			// 	setIsAlreadyCalling(true);
			// }
		});
	}, [socketState, connection]);

	const onMakeCall = async (id: string) => {
		if (!connection) return;
		await callUser({
			socketId: id,
			socket: socketState,
			peerConnection: connection,
		});
	};

	const handleSendMessage = (message: string) => {
		if (!socketState) return;
		socketState.send(
			JSON.stringify({
				event: 'message',
				data: {
					message,
					sender: socketState.id,
				},
			}),
		);
	};

	const onAcceptCall = async () => {
		if (!connection || !callOffer || !socketState) return;

		await connection.setRemoteDescription(
			new RTCSessionDescription(callOffer.offer),
		);

		const answer = await connection
			.createAnswer()
			.catch((err) => console.error(err));

		if (!answer) {
			return;
		}

		await connection.setLocalDescription(new RTCSessionDescription(answer));

		socketState.emit('make-answer', {
			answer,
			to: callOffer.socket,
		});
	};

	const onDeclineCall = () => {};

	return (
		<div>
			<App
				users={userList}
				onMakeCall={onMakeCall}
				videoRef={videoRef}
				remoteVideoRef={remoteVideoRef}
				messages={messages}
				onSendMessage={handleSendMessage}
				onAcceptCall={onAcceptCall}
				onDeclineCall={onDeclineCall}
				isBeingCalled={isBeingCalled}
				remoteUser={remoteUser}
				callOffer={callOffer?.socket}
			/>
		</div>
	);
};

export default AppContainer;
