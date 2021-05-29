import { RefObject } from 'react';
import { Grid } from 'semantic-ui-react';
import { Message } from 'src/common/types';
import AbonentList from '../AbonentList';
import CallScreen from '../CallScreen';
import MessageList from '../MessageList';

import styles from './styles.module.css';

type Props = {
	users: string[];
	onUserClick: CallableFunction;
	videoRef: RefObject<HTMLVideoElement>;
	remoteVideoRef: RefObject<HTMLVideoElement>;
	messages: Message[];
	onSendMessage: CallableFunction;
};

const App = ({
	users,
	onUserClick,
	videoRef,
	remoteVideoRef,
	messages,
	onSendMessage,
}: Props) => {
	return (
		<Grid celled='internally' className={styles.container}>
			<Grid.Row>
				<Grid.Column width={4} className={styles.column}>
					<AbonentList users={users} onUserClick={onUserClick} />
				</Grid.Column>
				<Grid.Column width={8} className={styles.column}>
					<CallScreen videoRef={videoRef} remoteVideoRef={remoteVideoRef} />
				</Grid.Column>
				<Grid.Column width={4} className={styles.column}>
					<MessageList messages={messages} onSendMessage={onSendMessage} />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default App;
