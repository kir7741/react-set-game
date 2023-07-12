/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useLayoutEffect, MouseEvent, forwardRef, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';

import styles from './Modal.module.css';

interface StyleMap {
	backdrop: string;
	modalWrapper: string;
	modal: string;
}

interface ModalProperty {
	/**
	 * 重新定位 left
	 *
	 * @type {string}
	 * @memberof ModalProperty
	 */
	left?: string;

	/**
	 * 重新定位 top
	 *
	 * @type {string}
	 * @memberof ModalProperty
	 */
	top?: string;

	/**
	 * class 名稱
	 *
	 * @type {Partial<StyleMap>}
	 * @memberof ModalProperty
	 */
	styleMap?: Partial<StyleMap>;

	/**
	 * 是否顯示
	 *
	 * @type {boolean}
	 * @memberof ModalProperty
	 */
	isOpen: boolean;

	/**
	 * 是否需要 backdrop
	 *
	 * @type {boolean}
	 * @memberof ModalProperty
	 */
	hasBackdrop?: boolean;

	/**
	 * 點擊backdrop事件
	 *
	 * @memberof ModalProperty
	 */
	onClickBackdrop?: (e: MouseEvent) => void;

	children: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProperty>(
	({ left, top, styleMap, isOpen, children, hasBackdrop = true, onClickBackdrop }, ref) => {
		let modalRoot = document.getElementById('modal-root');

		useLayoutEffect(() => {
			if (modalRoot === null) {
				modalRoot = document.createElement('div');
				modalRoot.setAttribute('id', 'modal-root');
				document.body.appendChild(modalRoot);
			}
		}, []);

		if (!isOpen) {
			return null;
		}

		return createPortal(
			<>
				{hasBackdrop && (
					<div
						className={classnames(styles.backdrop, styleMap?.backdrop)}
						onKeyDown={() => {}}
						onClick={onClickBackdrop}
					/>
				)}

				<div ref={ref} className={classnames(styles['modal-wrapper'])}>
					<div className={classnames(styles.modal, styleMap?.modal)} style={{ left, top }}>
						{children}
					</div>
				</div>
			</>,
			modalRoot as Element,
		) as unknown as ReactElement;
	},
);

export default Modal;
