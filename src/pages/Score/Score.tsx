import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../models/player';
import styles from './Score.module.css';

const Score = () => {
	const [{ playerList }, { clearAllPlayerScore }] = usePlayer();
	const navigation = useNavigate();

	const handleRestart = () => {
		navigation('/');
	};

	const handlePlayAgain = () => {
    clearAllPlayerScore();
		navigation('/game');
	};
	console.log(playerList);
	return (
		<div className={styles.score}>
			<ul>
				{playerList.map((player, index) => (
					<li key={index}>
						<span>{player.name}:</span>
						<span>{player.score}分</span>
					</li>
				))}
			</ul>
			<div>
				<button type="button" onClick={handleRestart}>
					重新開始
				</button>
				<button type="button" onClick={handlePlayAgain}>
					再來一局
				</button>
			</div>
		</div>
	);
};

export default Score;
