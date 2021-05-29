import { Grid, Header } from 'semantic-ui-react';

import styles from './styles.module.css';

type Props = {
	users: string[];
	onUserClick: CallableFunction;
};

const AbonentList = ({ users = [], onUserClick }: Props) => {
	return (
		<Grid className={styles.container}>
			<Grid.Row>
				<Header dividing className={styles.header} as='h2'>
					Abonent List
				</Header>
			</Grid.Row>
			<Grid.Column className={styles.list}>
				{users.length ? (
					users.map((user) => {
						return (
							<Grid.Row
								key={user}
								onClick={async () => await onUserClick(user)}
								className={styles.user}
							>
								{user}
							</Grid.Row>
						);
					})
				) : (
					<div>nobody is online</div>
				)}
			</Grid.Column>
		</Grid>
	);
};

export default AbonentList;
