import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Select from '../../components/atoms/Select/Select';
import Button from '../../components/atoms/Button/Button';

import styles from './Home.module.css';

const Home = () => {
	const [playerNumber, setPlayerNumber] = useState<string | number>(1);
	const navigate = useNavigate();

	return (
		<div className={styles.home}>
			Home
			<Select value={playerNumber} onChangeValue={e => setPlayerNumber(e)}>
				<option value={1}>1</option>
				<option value={2}>2</option>
				<option value={3}>3</option>
				<option value={4}>4</option>
			</Select>
			<Button onClick={() => navigate('game')}>開始遊戲</Button>
		</div>
	);
};

export default Home;
