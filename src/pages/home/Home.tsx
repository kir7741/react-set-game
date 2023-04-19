import React, { useState } from 'react';
import Select from '../../components/atoms/Select/Select';
import styles from './Home.module.css';

const Home = () => {
  const [playerNumber, setPlayerNumber] = useState<string | number>(1);
	return <div className={styles.home}>
    Home
    <Select value={playerNumber} onChangeValue={e => setPlayerNumber(e)}>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
    </Select>
  </div>;
};

export default Home;
