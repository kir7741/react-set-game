import { useNavigate } from 'react-router-dom';

import Button from '../../components/atoms/Button/Button';
import Input from '../../components/atoms/Input/Input';

import { usePlayer } from '../../models/player';

import styles from './Home.module.css';

const Home = () => {
	const navigate = useNavigate();
	const minAmount = 2;
	const maxAmount = 8;
	const [{ playerList }, { addPlayer, removePlayer, setPlayer }] = usePlayer();

	return (
		<div className={styles.home}>
			Game Set
			{playerList.map((info, index) => (
				<div key={info.id}>
					<Input
						value={info.name}
						onChangeValue={(val: string) => {
							setPlayer({
								id: info.id,
								name: val,
							});
						}}
						// onBlur={() => setPlayer(info.id)}
					/>
					<Button
						onClick={() => {
							if (playerList.length > minAmount) {
								removePlayer(info.id);
							}
						}}
					>
						-
					</Button>
				</div>
			))}
			<Button
				onClick={() => {
					if (playerList.length < maxAmount) {
						addPlayer();
					}
				}}
			>
				+
			</Button>
			<Button onClick={() => navigate('game')}>開始遊戲</Button>
		</div>
	);
};

export default Home;
