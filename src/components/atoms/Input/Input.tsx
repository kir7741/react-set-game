import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

/**
 * 樣式的介面
 *
 * @interface StyleMap
 */
 interface StyleMap {
	input: string;
}

interface InputProperty extends InputHTMLAttributes<HTMLInputElement> {
	onChangeValue: (val: string) => void;

}

const Input: React.FC<InputProperty> = ({ value, onChangeValue, onBlur, onFocus }) => {
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		onChangeValue(e.target.value);
	};

	return (
		<input 
			className={styles.input} 
			value={value} 
			onChange={handleOnChange}
			onBlur={onBlur}
			onFocus={onFocus}
		/>
	);
};

export default Input;
