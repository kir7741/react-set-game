import React, { HTMLAttributes, useRef, useState } from 'react';
import { CardInfo } from '../../../interface/card-info.interface';
import { AmountType } from '../../../enum/amount-type.enum';
import { ColorType } from '../../../enum/color-type.enum';
import { FillType } from '../../../enum/fill-type.enum';
import { ShapeType } from '../../../enum/shape-type.enum';
import { CardStatusType } from '../../../enum/card-status-type.enum';
import useCanvas from '../../../util/hook/useCanvas';

/**
 * 樣式的介面
 *
 * @interface StyleMap
 */
interface StyleMap {

}

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
	cardList?: CardInfo[]

}

const Paint: React.FC<PaintProperty> = ({ 
	id,
	cardList = [{
		id: "a",
		amount: AmountType.ONE,
		color: ColorType.BLUE,
		fill: FillType.FILLED,
		shape: ShapeType.CIRCLE,
		status: CardStatusType.DECK
	},
	{
		id: "a",
		amount: AmountType.ONE,
		color: ColorType.BLUE,
		fill: FillType.FILLED,
		shape: ShapeType.CIRCLE,
		status: CardStatusType.DECK
	}]
}) => {
  const canvasRef = useRef(null);
  const [count, setCount] = useState<number>(0);

	const [
		{canvasObj},
		{
			addRectangle,
			drawCard
		}
	// eslint-disable-next-line no-restricted-globals
	] = useCanvas(canvasRef as React.MutableRefObject<any>, {width: innerWidth, height: innerHeight - 200});

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
				// onClick={() => addRectangle({
				// 	action: (id: string) => {
				// 		console.log(id)
				// 	}
				// })}
				onClick={() => {


					const a = [
						{
							id: "a",
							amount: count,
							color: ColorType.RED,
							fill: FillType.SLASH,
							shape: ShapeType.CIRCLE,
							status: CardStatusType.DECK
						},
						{
							id: "b",
							amount: count,
							color: ColorType.GREEN,
							fill: FillType.SLASH,
							shape: ShapeType.SQUARE,
							status: CardStatusType.DECK
						},
						{
							id: "c",
							amount: count,
							color: ColorType.BLUE,
							fill: FillType.SLASH,
							shape: ShapeType.TRIANGLE,
							status: CardStatusType.DECK
						}

					];

					let random = Math.floor(Math.random() * 3);

					drawCard(a[2], count)
					setCount(pre => pre + 1);
				}}
			>click me</button>
		</>
	);
};

export default Paint;
