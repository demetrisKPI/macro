import { RefObject } from 'react';
import { Button, Grid, Message, Segment } from 'semantic-ui-react';

import styles from './styles.module.css';

type Props = {
	videoRef: RefObject<HTMLVideoElement>;
	remoteVideoRef: RefObject<HTMLVideoElement>;
	remoteUser: string;
};

const CallScreen = ({ videoRef, remoteVideoRef, remoteUser }: Props) => {
	return (
		<Grid celled='internally'>
			<Grid.Row>
				<Message className={styles.width} color='teal'>
					{remoteUser
						? `On a call with ${remoteUser}`
						: 'Select a user to make a call'}
				</Message>
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={8}>
					<video
						ref={videoRef}
						autoPlay
						muted
						className={styles.video}
						controls
					/>
				</Grid.Column>
				{/* <Grid.Column width={8}>
					<Segment placeholder className={styles.controls}>
						<Button
							circular
							icon='microphone'
							style={{ height: 'fit-content' }}
							size='massive'
							color='facebook'
						/>
						<Button
							circular
							icon='camera'
							style={{ height: 'fit-content' }}
							size='massive'
							color='teal'
						/>
						<Button
							circular
							icon='call'
							style={{ height: 'fit-content', transform: 'rotate(225deg)' }}
							size='massive'
							color='red'
						/>
					</Segment>
				</Grid.Column> */}
			</Grid.Row>
			<Grid.Row>
				<Grid.Column width={16}>
					<video ref={remoteVideoRef} autoPlay muted className={styles.video} />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default CallScreen;
