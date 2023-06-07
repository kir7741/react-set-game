import React from 'react';
import './Game.css';
import { useGame } from '../../models/game';
import Paint from '../../components/atoms/Paint/Paint';

const Game = () => {

  const [
    {
      cardsOfDeck
    },
    { }
  ] = useGame();
  
  return (
    <div className="home">
      {
        cardsOfDeck.map((info) => (
          <Paint 
            cardId={info.id}
            key={info.id}
          ></Paint>
        ))
      }
    </div>
  );
}

export default Game;
