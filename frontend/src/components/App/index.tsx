import { RefObject, useEffect, useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { Message } from 'src/common/types';
import UserList from '../UserList';
import CallScreen from '../CallScreen';
import MessageList from '../MessageList';

import styles from './styles.module.css';
import AcceptCallModal from '../AcceptCallModal';

type Props = {
	users: string[];
	onMakeCall: CallableFunction;
	onAcceptCall: CallableFunction;
	onDeclineCall: CallableFunction;
	videoRef: RefObject<HTMLVideoElement>;
	remoteVideoRef: RefObject<HTMLVideoElement>;
	messages: Message[];
	onSendMessage: CallableFunction;
	isBeingCalled: boolean;
	remoteUser: string;
	callOffer: string;
};

const App = ({
	users,
	onMakeCall,
	videoRef,
	remoteVideoRef,
	messages,
	onSendMessage,
	onAcceptCall,
	onDeclineCall,
	isBeingCalled,
	remoteUser,
	callOffer,
}: Props) => {
	const [isOpenModal, setIsOpenModal] = useState(false);

	useEffect(() => {
		if (isBeingCalled) setIsOpenModal(true);
	}, [isBeingCalled]);

	return (
		<Grid celled='internally' className={styles.container}>
			{isBeingCalled && (
				<AcceptCallModal
					user={callOffer}
					onAcceptCall={onAcceptCall}
					onDeclineCall={onDeclineCall}
					onClose={() => setIsOpenModal(false)}
					open={isOpenModal}
				/>
			)}
			<Grid.Row>
				<Grid.Column width={4} className={styles.column}>
					<UserList users={users} onMakeCall={onMakeCall} />
				</Grid.Column>
				<Grid.Column width={8} className={styles.column}>
					<CallScreen
						videoRef={videoRef}
						remoteVideoRef={remoteVideoRef}
						remoteUser={remoteUser}
					/>
				</Grid.Column>
				<Grid.Column width={4} className={styles.column}>
					<MessageList messages={messages} onSendMessage={onSendMessage} />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default App;
