import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { CardInfo } from '../../../interface/card-info.interface';
import { AmountType } from '../../../enum/amount-type.enum';
import { ColorType } from '../../../enum/color-type.enum';
import { FillType } from '../../../enum/fill-type.enum';
import { ShapeType } from '../../../enum/shape-type.enum';
import { CardStatusType } from '../../../enum/card-status-type.enum';
import useCanvas from '../../../util/hook/useCanvas';
import { useGame } from '../../../models/game';
import { checkSet } from '../../../util/helper/check-set';

/**
 * 樣式的介面
 *
 * @interface StyleMap
 */
interface StyleMap {}

interface PaintProperty extends HTMLAttributes<HTMLDivElement> {
	/**
	 * 元件 id
	 *
	 * @type {string}
	 * @memberof PaintProperty
	 */
	id: string;

	/**
	 * 卡片資訊
	 *
	 * @type {CardInfo[]}
	 * @memberof PaintProperty
	 */
	cardList?: CardInfo[];
}

const Paint: React.FC<PaintProperty> = ({
	id,
	cardList = [
		{
			id: 'a',
			amount: AmountType.ONE,
			color: ColorType.BLUE,
			fill: FillType.FILLED,
			shape: ShapeType.CIRCLE,
			status: CardStatusType.DECK,
		},
		{
			id: 'a',
			amount: AmountType.ONE,
			color: ColorType.BLUE,
			fill: FillType.FILLED,
			shape: ShapeType.CIRCLE,
			status: CardStatusType.DECK,
		},
	],
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [count, setCount] = useState<number>(0);
	const [
		{ pileOfCards, cardsOfDeck, isSelectedEnoughCards },
		{ updateCardStatus, moveCardsToScoredList, selectedCard, chooseCorrectCard, drawCardsOfDeck },
	] = useGame();

	const [{ fabricRef }, { toggleCardSelected, drawCard }] = useCanvas(canvasRef, {
		width: window.innerWidth,
		height: window.innerHeight,
	});


	const drawFn = (card: CardInfo, index: number) => {
		drawCard(card, index, () => {
			toggleCardSelected(card.id);
			selectedCard(card.id, card.status);
		});
	}

	useEffect(() => {
		// dependency array 有 cardsOfDeck 時，不論有沒有 clear 都無法切換狀態
		// dependency array 有 fabricRef.current 時，沒有 clear 無法切換狀態，有 clear 要第二次才會切換狀態
		if (fabricRef) {
			drawCardsOfDeck(fabricRef,drawFn);
		}
	}, [fabricRef]);

	// useEffect(() => {

	// 	if (!initRef.current) {
	// 		console.log('set true')
	// 		initRef.current = true;
	// 		// for(let i = 0 ; i <= 3 ; i++) {
	// 			canvas = new fabric.Canvas(canvasRef.current, {
	// 				width: 300,
	// 				height: 300
	// 			});

	// 			setTest(canvas);

	// 			// 创建一个可点击的矩形对象
	// 			const rectangle = new fabric.Rect({
	// 				left: 50,
	// 				top: 50,
	// 				width: 100,
	// 				height: 100,
	// 				fill: 'red',
	// 				selectable: true, // 设置为可选中
	// 			});

	// 			canvas.on('mouse:down', (e) => {
	// 				console.log('1', e)
	// 			});
	// 			canvas.add(rectangle);

	// 		// }

	// 		// 添加点击事件监听器
	// 		// rectangle.on('mousedown', (e) => {
	// 		// 	console.log(e)
	// 		// 	console.log(e)
	// 		//   rectangle.set('fill', 'green');
	// 		//   canvas.renderAll();
	// 		// });

	// 	}

	//   // 将矩形对象添加到 Canvas
	// }, []);

	return (
		<>
			<canvas ref={canvasRef} />
			<button
			// // onClick={() => addRectangle({
			// // 	action: (id: string) => {
			// // 		console.log(id)
			// // 	}
			// // })}
			// onClick={() => {
			// 	const shapeArray = [ShapeType.CIRCLE, ShapeType.SQUARE, ShapeType.TRIANGLE];
			// 	const fillArray = [FillType.FILLED, FillType.SLASH, FillType.TRANSPARENT];
			// 	const colorArray = [ColorType.RED, ColorType.BLUE, ColorType.GREEN];
			// 	const amountrandom = Math.floor(Math.random() * 3);
			// 	const shaperandom = Math.floor(Math.random() * 3);
			// 	const fillrandom = Math.floor(Math.random() * 3);
			// 	const colorrandom = Math.floor(Math.random() * 3);

			// 	const graphicData = {
			// 		id: 'b',
			// 		amount: amountrandom + 1,
			// 		color: colorArray[colorrandom],
			// 		fill: fillArray[fillrandom],
			// 		shape: shapeArray[shaperandom],
			// 		status: CardStatusType.DECK,
			// 	};

			// 	const merged = drawCard(graphicData, count, () => {
			// 		toggleCardSelected(graphicData.id);
			// 		updateCardStatus(graphicData.id, CardStatusType.PICKED);
			// 	});
			// 	setCount(pre => pre + 1);
			// }}
			>
				click me
			</button>

			{isSelectedEnoughCards && (
				<button
					type="button"
					onClick={() => {
						// 1. 取得使用者選取的卡片
						const pickedCard = cardsOfDeck.filter(card => card.status === CardStatusType.PICKED);
						// 2. 檢查卡片是否可以得分
						if (checkSet(pickedCard)) {

							// 3. 若可以得分則更新卡片狀態，重新繪製牌桌上的卡片，直到排堆中沒有卡片
							chooseCorrectCard(pickedCard);
							drawCardsOfDeck(fabricRef,drawFn);
							return;
						}
						// 移除並發牌
						// 4. 否 清空，跳通知 回到選擇角色頁面
						// selectedCard.forEach((card) => toggleCardSelected(card.id));
					}}
				>
					確定選完了嗎？
				</button>
			)}
		</>
	);
};

export default Paint;
