import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProperty extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick?: () => void;
}

const Button: React.FC<ButtonProperty> = ({ children, type, disabled, onClick }) => {
	return (
		<button className={styles.button} type={type} disabled={disabled} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
