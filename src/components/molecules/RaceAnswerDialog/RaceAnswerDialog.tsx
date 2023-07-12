import React, { useEffect, useState } from 'react';
import Modal from '../../atoms/Modal/Modal';
import { usePlayer } from '../../../models/player';

import styles from './RaceAnswerDialog.module.css';

interface RaceAnswerDialogProperty {
	isOpen: boolean;
	onChoosePlayer?: (playerId: string) => void;
}

const RaceAnswerDialog: React.FC<RaceAnswerDialogProperty> = ({
	isOpen,
	onChoosePlayer = () => {},
}) => {
	const [{ playerList }] = usePlayer();
	const [count, setCount] = useState(3);

	useEffect(() => {
		if (count > 0) {
			setTimeout(() => {
				setCount(count - 1);
			}, 1000);
		}
	}, [count]);

	return (
		<Modal
			isOpen={isOpen}
			styleMap={{
				modal: styles.modal,
			}}
		>
			{count > 0 ? (
				<div>{count}</div>
			) : (
				<>
					{playerList.map(player => (
						<div key={player.id}>
							<p>{player.name}</p>
							<button type="button" onClick={() => onChoosePlayer(player.id)}>
								搶答
							</button>
						</div>
					))}
				</>
			)}
		</Modal>
	);
};

export default RaceAnswerDialog;
