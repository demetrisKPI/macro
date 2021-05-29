import { RefObject } from 'react';
import { Grid } from 'semantic-ui-react';

import styles from './styles.module.css';

type Props = {
	videoRef: RefObject<HTMLVideoElement>;
	remoteVideoRef: RefObject<HTMLVideoElement>;
};

const CallScreen = ({ videoRef, remoteVideoRef }: Props) => {
	return (
		<Grid>
			<Grid.Row>
				<Grid.Column width={8}>
					<video ref={videoRef} autoPlay muted className={styles.video} />
				</Grid.Column>
				<Grid.Column width={8}>
					<video ref={remoteVideoRef} autoPlay muted className={styles.video} />
				</Grid.Column>
			</Grid.Row>
		</Grid>
	);
};

export default CallScreen;
