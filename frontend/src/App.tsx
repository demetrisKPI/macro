import { useRef, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [messages, setMessages] = useState<string[]>([]);

	const socket = io('http://localhost:5000');

	socket.on('broadcast', (data) => {
		console.log(data);
		setMessages([...messages, JSON.parse(data).data]);
	});

	socket.on('disconnected', () => {
		console.log('Closed');
	});

	// socket.onmessage = (msg: MessageEvent) => {
	// 	console.log(msg);
	// };

	const onSend = () => {
		socket.send(
			JSON.stringify({
				event: 'message',
				data: inputRef.current?.value || 'hello',
			}),
		);
	};

	return (
		<div
			style={{
				margin: '100px auto',
				width: 'fit-content',
			}}
		>
			<h1>hello there</h1>
			<input type='text' ref={inputRef}></input>
			<button onClick={onSend}>send message</button>
			{/* <ul>
				{messages.map((msg, i) => (
					<li key={i} style={{ margin: '20px 0' }}>
						{console.log(msg)}
						{msg}
					</li>
				))}
			</ul> */}
			<div>
				{messages.map((el, i) => (
					<div key={i}>{el}</div>
				))}
			</div>
		</div>
	);
}

export default App;
