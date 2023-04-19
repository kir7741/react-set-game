import React, { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

interface SelectProperty extends SelectHTMLAttributes<HTMLSelectElement> {
	onChangeValue: (val: string | number) => void;
}

const Select: React.FC<SelectProperty> = ({ children, value, onChangeValue }) => {
	const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		onChangeValue(e.target.value);
	};

	return (
		<select className={styles.select} value={value} onChange={handleOnChange}>
			{children}
		</select>
	);
};

export default Select;
