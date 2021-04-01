import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const { RTCPeerConnection, RTCSessionDescription } = window;

const constraints: MediaStreamConstraints = {
	video: {
		width: 1366,
		height: 768,
	},
	audio: true,
};

const onSend = (message: string, socket?: Socket) => {
	if (!socket) return;
	socket.send(
		JSON.stringify({
			event: 'message',
			data: message,
		}),
	);
};

function App() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const [socketState, setSocketState] = useState<Socket>();
	const [messages, setMessages] = useState<string[]>([]);
	const [message, setMessage] = useState<string>('hello');

	const [isAlreadyCalling, setIsAlreadyCalling] = useState(false);

	const peerConnection = new RTCPeerConnection();
	const [userList, setUserList] = useState<string[]>([]);

	async function callUser(socketId: string) {
		if (!socketState) return;
		const offer = await peerConnection.createOffer();
		await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

		socketState.emit('call-user', {
			offer,
			to: socketId,
		});
	}

	useEffect(() => {
		const socket = io('http://localhost:5000');
		setSocketState(socket);
	}, []);

	useEffect(() => {
		if (!socketState) return;

		peerConnection.ontrack = function ({ streams: [stream] }) {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = stream;
			}
		};

		socketState.on('message', (data) => {
			setMessages([...messages, JSON.parse(data).data]);
		});

		socketState.on('disconnected', () => {
			console.log('Closed');
		});

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
				stream
					.getTracks()
					.forEach((track) => peerConnection.addTrack(track, stream));
			})
			.catch((err) => {
				console.error(err);
			});

		socketState.on('update-user-list', ({ users }: { users: string[] }) => {
			console.log(users);
			setUserList(users);
		});

		socketState.on('call-made', async (data) => {
			await peerConnection.setRemoteDescription(
				new RTCSessionDescription(data.offer),
			);
			const answer = await peerConnection.createAnswer();
			await peerConnection.setLocalDescription(
				new RTCSessionDescription(answer),
			);

			socketState.emit('make-answer', {
				answer,
				to: data.socket,
			});
		});

		socketState.on('answer-made', async (data) => {
			if (isAlreadyCalling) return;

			await peerConnection
				.setRemoteDescription(new RTCSessionDescription(data.answer))
				.catch((err) => console.log(err));

			if (!isAlreadyCalling) {
				callUser(data.socket);
				setIsAlreadyCalling(true);
			}
		});

		socketState.on('remove-user', ({ socketId }) => {
			const elToRemove = document.getElementById(socketId);

			if (elToRemove) elToRemove.remove();
		});
	}, [socketState]);

	const chatMsgs = () => messages.map((el, i) => <div key={i}>{el}</div>);

	const userListDiv = () =>
		userList.map((el, i) => (
			<div key={i} onClick={async () => await callUser(el)}>
				{el}
			</div>
		));

	return (
		<div
			style={{
				padding: '100px',
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
			}}
		>
			<div>
				<h1>Say hi</h1>
				<input
					type='text'
					onChange={(e) => setMessage(e.target.value || '')}
				></input>
				<button onClick={() => onSend(message, socketState)}>
					send message
				</button>
				<div>{chatMsgs()}</div>
				<div>{userListDiv()}</div>
			</div>
			<video ref={videoRef} autoPlay muted style={{ marginRight: '400px' }} />
			<video
				ref={remoteVideoRef}
				autoPlay
				muted
				style={{ marginRight: '400px' }}
			/>
		</div>
	);
}

export default App;
