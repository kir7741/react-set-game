import { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { CanvasOptions } from '../../interface/canvas-options.interface';
import { CardInfo } from '../../interface/card-info.interface';
import { ColorType } from '../../enum/color-type.enum';
import { ShapeType } from '../../enum/shape-type.enum';
import { FillType } from '../../enum/fill-type.enum';
import { CardStatusType } from '../../enum/card-status-type.enum';
import { useSelector } from 'react-redux';

type CanvasMap = {
	canvasObj: fabric.Canvas;
};

const cardWidth = 75;
const cardHeight = 120;

const useCanvas = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	option: CanvasOptions,
): [canvasMap: CanvasMap, handler: Record<string, any>] => {
	const initRef = useRef(false);
	const [canvasObj, setCanvasObj] = useState<any>(null);
  const test = useSelector((state) => state);
  console.log(test)

	useEffect(() => {
		// 初始化畫布
		if (!initRef.current) {
			initRef.current = true;
			const canvasObj: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
				width: option.width,
				height: option.height,
			});

			setCanvasObj(canvasObj);
		}
	}, []);

	// TODO: 是否把所有 fabric 圖像物件轉成陣列或物件（把cardInfo當作區分其差異的東西）
  // 傳出 => 要傳出，由使用的人丟入圖像物件當參數 然觸發內部韓式（ex: toggleCardSize）
	// TODO: 綁點擊事件 個別綁嗎 =>  個別綁定，傳事件進去
	// TODO: 先移除排堆資料後 => 補牌 => 算位置 => 動畫（）

	/**
	 * 畫卡片
	 *
	 * @param cardInfo - 卡片資訊
	 * @param index - 索引位置
	 */
	const drawCard = (cardInfo: CardInfo, index: number, clickHandler: () => void) => {
		const cardBorder = new fabric.Rect({
			width: cardWidth,
			height: cardHeight,
			top: 5 + Math.floor(index / 6) * (cardHeight + 20),
			left: 150 + (index % 6) * (cardWidth + 20),
			stroke: 'black',
			strokeWidth: 5,
			fill: 'rgba(0,0,0,0)',
			selectable: false,
		});

		const text = drawNumberText(cardInfo, index);

		const shape = drawShape(cardInfo, index);

		// 圖組合併
		const merge = new fabric.Group([cardBorder, shape, text], {
			data: cardInfo,
			selectable: false,
		});

		merge.on('mousedown', e => {
      
      console.log('click')


    });

		canvasObj.add(merge);

    return merge;

	};

  const toggleCardSize = (graphic: fabric.Object, scaleAmt: number) => {
    console.log('trig')
    console.log(graphic, scaleAmt)
    graphic.scaleX = scaleAmt;
    graphic.scaleY = scaleAmt;
  }

	/**
	 * 取得顏色色碼
	 *
	 * @param type - 顏色類別
	 * @returns
	 */
	const getColor = (type: ColorType) => {
		let color = '';
		switch (type) {
			case ColorType.RED:
				color = '#E1282e';
				break;
			case ColorType.GREEN:
				color = '#24af3b';
				break;
			case ColorType.BLUE:
				color = '#420a8c';
				break;
		}

		return color;
	};

	/**
	 * 繪出圖型（顏色、填充、形狀）
	 *
	 * @param cardInfo - 卡片資訊
	 * @param index - 索引位置
	 * @returns
	 */
	const drawShape = (cardInfo: CardInfo, index: number) => {
		const color = getColor(cardInfo.color);
		let graphic = null;

		switch (cardInfo.shape) {
			case ShapeType.CIRCLE:
				switch (cardInfo.fill) {
					case FillType.TRANSPARENT:
						graphic = new fabric.Circle({
							radius: 30,
							top: 30 + Math.floor(index / 6) * (cardHeight + 20),
							left: 158 + (index % 6) * (cardWidth + 20),
							stroke: color,
							strokeWidth: 5,
							fill: 'rgba(0,0,0,0)',
							selectable: true,
						});
						break;

					case FillType.FILLED:
						console.log();
						graphic = new fabric.Circle({
							radius: 30,
							top: 30 + Math.floor(index / 6) * (cardHeight + 20),
							left: 158 + (index % 6) * (cardWidth + 20),
							stroke: color,
							strokeWidth: 5,
							fill: color,
							selectable: true,
						});
						break;

					case FillType.SLASH:
						graphic = [1, 2, 3].reduce(
							(pre: any, cur) => {
								console.log(pre);
								return new fabric.Group([
									pre,
									new fabric.Circle({
										radius: 30 - +cur * 8,
										top: 30 + Math.floor(index / 6) * (cardHeight + 20) + +cur * 8,
										left: 158 + (index % 6) * (cardWidth + 20) + +cur * 8,
										stroke: color,
										strokeWidth: 5,
										fill: 'rgba(0,0,0,0)',
										selectable: true,
									}),
								]);
							},
							new fabric.Circle({
								radius: 30,
								top: 30 + Math.floor(index / 6) * (cardHeight + 20),
								left: 158 + (index % 6) * (cardWidth + 20),
								stroke: color,
								strokeWidth: 5,
								fill: 'rgba(0,0,0,0)',
								selectable: true,
							}),
						);

						break;
				}

				break;
			case ShapeType.TRIANGLE:
				switch (cardInfo.fill) {
					case FillType.TRANSPARENT:
						graphic = new fabric.Triangle({
							width: 60,
							height: 60,
							angle: 0,
							top: 25 + Math.floor(index / 6) * (cardHeight + 20),
							left: 158 + (index % 6) * (cardWidth + 20),
							stroke: color,
							strokeWidth: 5,
							fill: 'rgba(0,0,0,0)',
							selectable: true,
						});
						break;

					case FillType.FILLED:
						graphic = new fabric.Triangle({
							width: 60,
							height: 60,
							angle: 0,
							top: 25 + Math.floor(index / 6) * (cardHeight + 20),
							left: 158 + (index % 6) * (cardWidth + 20),
							stroke: color,
							strokeWidth: 5,
							fill: color,
							selectable: true,
						});
						break;

					case FillType.SLASH:
						graphic = [1, 2, 3, 4].reduce(
							(pre: any, cur) => {
								const unit = +cur * 5;
								return new fabric.Group([
									pre,
									new fabric.Triangle({
										width: 60 - unit * 2,
										height: 60 - unit * 2,
										angle: 0,
										top: 25 + Math.floor(index / 6) * (cardHeight + 20) + unit * 2,
										left: 158 + (index % 6) * (cardWidth + 20) + unit * 2,
										stroke: color,
										strokeWidth: 5,
										fill: 'rgba(0,0,0,0)',
										selectable: true,
									}),
								]);
							},
							new fabric.Triangle({
								width: 60,
								height: 60,
								angle: 0,
								top: 25 + Math.floor(index / 6) * (cardHeight + 20),
								left: 158 + (index % 6) * (cardWidth + 20),
								stroke: color,
								strokeWidth: 5,
								fill: 'rgba(0,0,0,0)',
								selectable: true,
							}),
						);

						break;
				}

				break;
			case ShapeType.SQUARE:
				switch (cardInfo.fill) {
					case FillType.TRANSPARENT:
						graphic = new fabric.Rect({
							width: 60,
							height: 60,
							top: 25 + Math.floor(index / 6) * (cardHeight + 20),
							left: 158 + (index % 6) * (cardWidth + 20),
							stroke: color,
							strokeWidth: 5,
							fill: 'rgba(0,0,0,0)',
							selectable: true,
						});
						break;

					case FillType.FILLED:
						graphic = new fabric.Rect({
							width: 60,
							height: 60,
							top: 25 + Math.floor(index / 6) * (cardHeight + 20),
							left: 158 + (index % 6) * (cardWidth + 20),
							stroke: color,
							strokeWidth: 5,
							fill: color,
							selectable: true,
						});
						break;

					case FillType.SLASH:
						graphic = [1, 2, 3].reduce(
							(pre: any, cur) => {
								console.log(pre);
								return new fabric.Group([
									pre,
									new fabric.Rect({
										width: 60 - +cur * 16,
										height: 60 - +cur * 16,
										top: 25 + Math.floor(index / 6) * (cardHeight + 20) + +cur * 8,
										left: 158 + (index % 6) * (cardWidth + 20) + +cur * 8,
										stroke: color,
										strokeWidth: 5,
										fill: 'rgba(0,0,0,0)',
										selectable: true,
									}),
								]);
							},
							new fabric.Rect({
								width: 60,
								height: 60,
								top: 25 + Math.floor(index / 6) * (cardHeight + 20),
								left: 158 + (index % 6) * (cardWidth + 20),
								stroke: color,
								strokeWidth: 5,
								fill: 'rgba(0,0,0,0)',
								selectable: true,
							}),
						);

						break;
				}

				break;
		}

		return graphic;
	};

	/**
	 * 畫出數量數字
	 *
	 * @param cardInfo - 卡片資訊
	 * @param index - 索引位置
	 * @returns
	 */
	const drawNumberText = (cardInfo: CardInfo, index: number): fabric.Text => {
		const textGraphic = new fabric.Text(cardInfo.amount.toString(), {
			top: 50 + Math.floor(index / 6) * (cardHeight + 20),
			left: 182 + (index % 6) * (cardWidth + 20),
			fontSize: 24,
			fill: '#dedede',
		});

		return textGraphic;
	};

	return [
		{
			canvasObj,
		},
		{
			drawCard,
      toggleCardSize
		},
	];
};

export default useCanvas;
