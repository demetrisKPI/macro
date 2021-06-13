import { Button, Card, Icon, Modal } from 'semantic-ui-react';

import styles from './styles.module.css';

type Props = {
	user: string;
	onMakeCall: CallableFunction;
	onClose: CallableFunction;
	open: boolean;
};

const CallActionModal = ({ user, onMakeCall, open, onClose }: Props) => {
	return (
		<Modal open={open} onClose={() => onClose()} className={styles.card}>
			<Card className={styles.card}>
				<Card.Content style={{ marginBottom: '40px' }}>
					<Card.Header className={styles.header} dividing>
						{user}
					</Card.Header>
					<Card.Meta>
						<Icon name='user circle' color='teal' size='big' />
						{`Available for a call                       `}
					</Card.Meta>
				</Card.Content>
				<Card.Content extra>
					{/* <Button
						color='green'
						onClick={async () => {
							await onMakeCall(user);
							onClose();
						}}
						style={{ width: '100%' }}
					>
						Call
					</Button> */}
				</Card.Content>
			</Card>
		</Modal>
	);
};

export default CallActionModal;
