import { Button, Card, Modal } from 'semantic-ui-react';

import styles from './styles.module.css';

type Props = {
	user: string;
	onAcceptCall: CallableFunction;
	onDeclineCall: CallableFunction;
	onClose: CallableFunction;
	open: boolean;
};

const AcceptCallModal = ({
	user,
	open,
	onClose,
	onAcceptCall,
	onDeclineCall,
}: Props) => {
	return (
		<Modal open={open} onClose={() => onClose()} className={styles.card}>
			<Card className={styles.card}>
				<Card.Content style={{ marginBottom: '20px' }}>
					<Card.Header className={styles.header}>{user}</Card.Header>
					<Card.Meta>is calling you</Card.Meta>
				</Card.Content>
				<Card.Content extra style={{ width: '100%' }}>
					{/* <div className='ui two buttons'>
						<Button
							basic
							color='green'
							onClick={async () => {
								await onAcceptCall();
								onClose();
							}}
						>
							Accept
						</Button>
						<Button
							basic
							color='red'
							onClick={async () => {
								await onDeclineCall();
								onClose();
							}}
						>
							Decline
						</Button>
					</div> */}
				</Card.Content>
			</Card>
		</Modal>
	);
};

export default AcceptCallModal;
