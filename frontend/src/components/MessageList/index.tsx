import { useState } from 'react';
import { Grid, Header, Input, List, Segment } from 'semantic-ui-react';
import { Message } from 'src/common/types';

import styles from './styles.module.css';

type Props = {
	messages?: Message[];
	onSendMessage: CallableFunction;
};

const MessageList = ({ messages = [], onSendMessage }: Props) => {
	const [message, setMessage] = useState<string>('');
	return (
		<Grid className={styles.chat}>
			<Grid.Row>
				<Header dividing className={styles.header} as='h2'>
					Chat
				</Header>
			</Grid.Row>
			<Grid.Row>
				<Input
					size='big'
					type='text'
					className={styles.header}
					action={{
						icon: {
							name: 'envelope',
							link: true,
							onClick: () => message && onSendMessage(message),
						},
					}}
					placeholder='Type a message...'
					onChange={(e) => setMessage(e.target.value)}
				/>
			</Grid.Row>
			<Grid.Column className={styles.msgs}>
				<List relaxed>
					{messages.map((msg: Message, index) => {
						return (
							<List.Item key={index}>
								<Segment>
									<List.Header className={styles.sender}>
										{msg.sender}
									</List.Header>
									<List.Content>{msg.message}</List.Content>
								</Segment>
							</List.Item>
						);
					})}
				</List>
			</Grid.Column>
		</Grid>
	);
};

export default MessageList;
