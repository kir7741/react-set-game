import { useNavigate } from 'react-router-dom';
import Button from '../../components/atoms/Button/Button';

import styles from './Home.module.css';
import Input from '../../components/atoms/Input/Input';
import { usePlayer } from '../../models/player';

const Home = () => {
	const navigate = useNavigate();
	const [
		{
			playerList
		},
		{
			addPlayer,
			removePlayer,
			setPlayer
		}
	] = usePlayer();

	// const [playerNames, setPlayerNames] = useState<string[]>([]);

	return (
		<div className={styles.home}>
			Game Set
			{
				playerList
					.map((info, index) => 
						<div key={info.id}>
							<Input
								value={info.name}
								onChangeValue={(val: string) => {
									console.log('change')
									setPlayer({
										id: info.id,
										name: val
									})
								}}
								// onBlur={() => setPlayer(info.id)}
							/>
							<Button onClick={() => removePlayer(info.id)}> - </Button>
						</div>
				)
			}
			<Button onClick={() => addPlayer()}> + </Button>
			<Button onClick={() => navigate('game')}>開始遊戲</Button>
		</div>
	);
};

export default Home;
