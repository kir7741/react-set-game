import { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { CanvasOptions } from '../../interface/canvas-options.interface';
import { CardInfo } from '../../interface/card-info.interface';
import { ColorType } from '../../enum/color-type.enum';
import { ShapeType } from '../../enum/shape-type.enum';
import { FillType } from '../../enum/fill-type.enum';
import rtw from '../../../src/assets/img/red-transparent-wave.svg';
import rto from '../../../src/assets/img/red-transparent-oval.svg';
import rtd from '../../../src/assets/img/red-transparent-diamond.svg';
import rgw from '../../../src/assets/img/red-gradient-wave.svg';
import rgo from '../../../src/assets/img/red-gradient-oval.svg';
import rgd from '../../../src/assets/img/red-gradient-diamond.svg';
import rfw from '../../../src/assets/img/red-filled-wave.svg';
import rfo from '../../../src/assets/img/red-filled-oval.svg';
import rfd from '../../../src/assets/img/red-filled-diamond.svg';
import ptw from '../../../src/assets/img/purple-transparent-wave.svg';
import pto from '../../../src/assets/img/purple-transparent-oval.svg';
import ptd from '../../../src/assets/img/purple-transparent-diamond.svg';
import pgw from '../../../src/assets/img/purple-gradient-wave.svg';
import pgo from '../../../src/assets/img/purple-gradient-oval.svg';
import pgd from '../../../src/assets/img/purple-gradient-diamond.svg';
import pfw from '../../../src/assets/img/purple-filled-wave.svg';
import pfo from '../../../src/assets/img/purple-filled-oval.svg';
import pfd from '../../../src/assets/img/purple-filled-diamond.svg';
import gtw from '../../../src/assets/img/green-transparent-wave.svg';
import gto from '../../../src/assets/img/green-transparent-oval.svg';
import gtd from '../../../src/assets/img/green-transparent-diamond.svg';
import ggw from '../../../src/assets/img/green-gradient-wave.svg';
import ggo from '../../../src/assets/img/green-gradient-oval.svg';
import ggt from '../../../src/assets/img/green-gradient-diamond.svg';
import gfw from '../../../src/assets/img/green-filled-wave.svg';
import gfo from '../../../src/assets/img/green-filled-oval.svg';
import gfd from '../../../src/assets/img/green-filled-diamond.svg';

const imgMap = {
	'red-transparent-wave': rtw,
	'red-transparent-oval': rto,
	'red-transparent-diamond': rtd,
	'red-gradient-wave': rgw,
	'red-gradient-oval': rgo,
	'red-gradient-diamond': rgd,
	'red-filled-wave': rfw,
	'red-filled-oval': rfo,
	'red-filled-diamond': rfd,
	'purple-transparent-wave': ptw,
	'purple-transparent-oval': pto,
	'purple-transparent-diamond': ptd,
	'purple-gradient-wave': pgw,
	'purple-gradient-oval': pgo,
	'purple-gradient-diamond': pgd,
	'purple-filled-wave': pfw,
	'purple-filled-oval': pfo,
	'purple-filled-diamond': pfd,
	'green-transparent-wave': gtw,
	'green-transparent-oval': gto,
	'green-transparent-diamond': gtd,
	'green-gradient-wave': ggw,
	'green-gradient-oval': ggo,
	'green-gradient-diamond': ggt,
	'green-filled-wave': gfw,
	'green-filled-oval': gfo,
	'green-filled-diamond': gfd,
};

type CanvasMap = {
	fabricRef: React.MutableRefObject<fabric.Canvas | null>;
};

type CanvasActionMap = {
	drawCard: (cardInfo: CardInfo, index: number, clickHandler?: () => void) => Promise<fabric.Group>;
	toggleCardSelected: (id: string) => void;
};

const cardWidth = 120;
const cardHeight = 200;

const useCanvas = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	option: CanvasOptions,
): [canvasMap: CanvasMap, handler: CanvasActionMap] => {
	const fabricRef = useRef<fabric.Canvas | null>(null);

	useEffect(() => {
		if (canvasRef.current !== null) {
			fabricRef.current = new fabric.Canvas(canvasRef.current, {
				width: option.width,
				height: option.height,
			});
		}

		return () => {
			if (fabricRef.current) {
				fabricRef.current.dispose();
			}
		};
	}, [fabricRef]);

	// TODO: 是否把所有 fabric 圖像物件轉成陣列或物件（把cardInfo當作區分其差異的東西）
	// 傳出 => 要傳出，由使用的人丟入圖像物件當參數 然觸發內部韓式（ex: toggleCardSize）
	// TODO: 綁點擊事件 個別綁嗎 =>  個別綁定，傳事件進去
	// TODO: 先移除排堆資料後 => 補牌 => 算位置 => 動畫（）
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
			case ColorType.PURPLE:
				color = '#420a8c';
				break;
		}

		return color;
	};

	/**
	 * 切換卡片選取狀態
	 *
	 * @param {string} cardId
	 */
	const toggleCardSelected = (cardId: string) => {
		if (!fabricRef.current) {
			return;
		}

		const cardGroupList = fabricRef.current.getObjects();
		const targetCard = cardGroupList.find(cardGroup => {
			return cardGroup.data.id === cardId;
		}) as fabric.Group;

		const groupList = targetCard!.getObjects();
		const cardBorderIndex = groupList.findIndex(group => group.data === 'border');
		const cardBorder = targetCard.item(cardBorderIndex);
		const originBorderColor = cardBorder.stroke;

		if (originBorderColor === 'black') {
			console.log('change to gray');
			cardBorder.set({
				stroke: 'gray',
			});
			return;
		}
		console.log('change to black');

		cardBorder.set({
			stroke: 'black',
		});
	};

	/**
	 * 畫卡片
	 *
	 * @param cardInfo - 卡片資訊
	 * @param index - 索引位置
	 */
	const drawCard = async (
		cardInfo: CardInfo,
		index: number,
		clickHandler = () => {},
	): Promise<fabric.Group> => {
		const border = drawCardBorder(index);
		const text = drawNumberText(cardInfo, index);

		// 圖組合併
		const merge = new fabric.Group([border, text], {
			data: cardInfo,
			selectable: false,
			originX: 'center',
			originY: 'center',
		});

		console.log(merge)
		console.log('---------')
		
		drawShape(cardInfo, index, (oImg: any) => {
			merge.addWithUpdate(oImg);
			fabricRef.current!.renderAll();
		});


		merge.on('mousedown', e => {
			clickHandler();
		});

		if (fabricRef.current) {
			fabricRef.current.add(merge);
			fabricRef.current.renderAll();
		}

		return merge;
	};

	/**
	 * 繪製卡片邊框
	 *
	 * @param {number} index - 索引位置
	 * @return {*}  {fabric.Rect}
	 */
	const drawCardBorder = (index: number): fabric.Rect => {
		const columns = 6;
		const verticalGap = 20;
		const horizontalGap = 20;

		const cardBorder = new fabric.Rect({
			width: cardWidth,
			height: cardHeight,
			top: 5 + Math.floor(index / columns) * (cardHeight + verticalGap),
			left: 150 + (index % columns) * (cardWidth + horizontalGap),
			stroke: 'black',
			strokeWidth: 5,
			fill: 'rgba(0, 0, 0, 0)',
			selectable: false,
			data: 'border',
		});

		return cardBorder;
	};

	/**
	 * 繪出圖型（顏色、填充、形狀）
	 *
	 * @param cardInfo - 卡片資訊
	 * @param index - 索引位置
	 * @returns
	 */
	const drawShape = (
		cardInfo: CardInfo, 
		index: number,
		handler: any
	): void => {
		// const draw = (info: CardInfo): Promise<fabric.Object> =>
		// 	new Promise((resolve, reject) => {
		// 		fabric.Image.fromURL(imgMap[`${info.color}-${info.fill}-${info.shape}`], function (oImg) {
		// 			oImg.top = 75 + Math.floor(index / 6) * (cardHeight + 20);
		// 			oImg.left = 165 + (index % 6) * (cardWidth + 20);
		// 			oImg.scaleX = 0.8;
		// 			oImg.scaleY = 0.8;
		// 			resolve(oImg);
		// 		});
		// 	});
		
		// const graphic = await draw(cardInfo);
		// console.log(graphic)
		// return graphic;

		fabric.Image.fromURL(imgMap[`${cardInfo.color}-${cardInfo.fill}-${cardInfo.shape}`], function (oImg) {
			oImg.top = 75 + Math.floor(index / 6) * (cardHeight + 20);
			oImg.left = 165 + (index % 6) * (cardWidth + 20);
			oImg.scaleX = 0.8;
			oImg.scaleY = 0.8;
			handler(oImg);
		});



	};

	/**
	 * 畫出數量數字
	 *
	 * @param cardInfo - 卡片資訊
	 * @param index - 索引位置
	 * @returns
	 */
	const drawNumberText = (cardInfo: CardInfo, index: number): fabric.Group => {
		const topTextGraphic = new fabric.Text(cardInfo.amount.toString(), {
			top: 15 + Math.floor(index / 6) * (cardHeight + 20),
			left: 160 + (index % 6) * (cardWidth + 20),
			fontSize: 24,
			fill: '#000',
		});

		const downTextGraphic = new fabric.Text(cardInfo.amount.toString(), {
			top: 170 + Math.floor(index / 6) * (cardHeight + 20),
			left: 250 + (index % 6) * (cardWidth + 20),
			fontSize: 24,
			fill: '#000',
		});

		downTextGraphic.rotate(180);

		return new fabric.Group([topTextGraphic, downTextGraphic]);
	};

	return [
		{
			fabricRef,
		},
		{
			drawCard,
			toggleCardSelected,
		},
	];
};

export default useCanvas;
