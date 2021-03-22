import { RefObject, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const constraints: MediaStreamConstraints = {
	video: {
		width: 1366,
		height: 768,
	},
	audio: true,
};

const onSend = (socket?: Socket, ref?: RefObject<HTMLInputElement>) => {
	if (!socket || !ref) return;
	socket.send(
		JSON.stringify({
			event: 'message',
			data: ref.current?.value || 'hello',
		}),
	);
};

function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [socketState, setSocketState] = useState<Socket>();
	const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		// (async () =>
		// 	console.log(await navigator.mediaDevices.enumerateDevices()))();
		const socket = io('http://localhost:5000', {});

		socket.on('message', (data) => {
			setMessages([...messages, JSON.parse(data).data]);
			console.log(JSON.parse(data).data);
		});

		socket.on('disconnected', () => {
			console.log('Closed');
		});

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			})
			.catch((err) => {
				console.error(err);
			});

		setSocketState(socket);
	}, []);

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
				<input type='text' ref={inputRef}></input>
				<button onClick={() => onSend(socketState, inputRef)}>
					send message
				</button>
				<div>
					{messages.map((el, i) => (
						<div key={i}>{el}</div>
					))}
				</div>
			</div>
			<video
				ref={videoRef}
				autoPlay
				muted
				style={{ rotate: '90deg', marginRight: '400px' }}
			/>
		</div>
	);
}

export default App;
