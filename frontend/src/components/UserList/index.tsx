import { useState } from 'react';
import {
	Button,
	Container,
	Grid,
	Header,
	Icon,
	Label,
	Message,
	Segment,
} from 'semantic-ui-react';
import CallActionModal from '../MakeCallModal';

import styles from './styles.module.css';

type Props = {
	users: string[];
	onMakeCall: CallableFunction;
};

const UserList = ({ users = [], onMakeCall }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [user, setUser] = useState('');

	return (
		<Grid className={styles.container}>
			<Grid.Row>
				<Header dividing className={styles.header} as='h2'>
					Users
					<Label tag color='teal' className={styles.label}>
						<Icon name='user' />
						{users.length} online
					</Label>
				</Header>
			</Grid.Row>
			{/* <Grid.Column className={styles.list}>
				{users.length ? (
					users.map((user) => {
						return (
							<Grid.Row key={user} className={styles.user}>
								<Segment className={styles.flex}>
									<Container>{user}</Container>
									<Button
										color='teal'
										onClick={() => {
											setIsModalOpen(true);
											setUser(user);
										}}
										className={styles.button}
									>
										See details
									</Button>
								</Segment>
							</Grid.Row>
						);
					})
				) : (
					<Message color='teal'>Nobody is online</Message>
				)}
			</Grid.Column> */}
			<CallActionModal
				open={isModalOpen}
				user={user}
				onMakeCall={onMakeCall}
				onClose={() => setIsModalOpen(false)}
			/>
		</Grid>
	);
};

export default UserList;
