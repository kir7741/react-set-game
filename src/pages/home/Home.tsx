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
			addPlayer
		}
	] = usePlayer();

	// const [playerNames, setPlayerNames] = useState<string[]>([]);

	// TODO: map 的 key處理、第一個名字不顯示刪除、排版

	return (
		<div className={styles.home}>
			Game Set
			{
				playerList
					.map((info, index) => 
						<div key={info.id}>
							12
							<Input
								value={info.name}
								onChangeValue={ () => {}
									// 	TODO: add player Name Chage hook
									// e => setPlayerNames((pre) => {
									// 	const names = [...playerNames];
									// 	names[index] = e;
									// 	return names;
									// })
								}
							/>
							<Button
								onClick={() => {
									// TODO: remove player Name Chage hook
									// setPlayerNames(playerNames.filter((n, i) => i !== index))
								}}
							> - </Button>
						</div>
				)
			}

			<Button onClick={() => addPlayer()}> + </Button>

			<Button onClick={() => navigate('game')}>開始遊戲</Button>
		</div>
	);
};

export default Home;
