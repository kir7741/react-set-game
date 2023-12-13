import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../models/player';

interface GameGuardProperty {
  children: React.ReactNode
}

const GameGuard: React.FC<GameGuardProperty> = ({ children }) => {
	const [{ playerList }] = usePlayer();
	const navigation = useNavigate();

  useEffect(() => {
    if (
      playerList.length <= 0 ||
      playerList.some((playerInfo) => !playerInfo.name)
    ) {
      navigation('/');
    }
  }, [])
	return <>{children}</>;
};

export default GameGuard;
