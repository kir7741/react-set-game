import { useNavigate } from 'react-router-dom';

import Button from '../../components/atoms/Button/Button';
import Input from '../../components/atoms/Input/Input';

import { usePlayer } from '../../models/player';

import styles from './Home.module.css';

const Home = () => {
	const navigate = useNavigate();
	const [{ playerList }, { addPlayer, removePlayer, setPlayer }] = usePlayer();

	return (
		<div className={styles.home}>
			<div className={styles.logo}>Game Set</div>
			<form className={styles.form}>
				<div className={styles['player-list']}>
					{playerList.map(info => (
						<div key={info.id} className={styles['input-box']}>
							<Input
								value={info.name}
								onChangeValue={(val: string) => {
									setPlayer({
										id: info.id,
										name: val,
									});
								}}
							/>
							<Button
								type="button"
								onClick={() => removePlayer(info.id)}
							>
								x
							</Button>
						</div>
					))}
				</div>
				<div className={styles['button-area']}>
					<Button
						type="button"
						onClick={() => addPlayer()}
					>
						新增玩家
					</Button>
					<Button type="button" onClick={() => navigate('game')}>
						開始遊戲
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Home;
