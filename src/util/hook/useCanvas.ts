
import { useRef, useEffect, useState } from 'react';
import {fabric} from 'fabric'
import { CanvasSettingInfo } from '../../interface/canvas-setting-info.interface';
import { CardInfo } from '../../interface/card-info.interface';

type CanvasMap = {
  canvasObj: fabric.Canvas
}

const useCanvas = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  option: CanvasSettingInfo
): [canvasMap: CanvasMap, handler: Record<string, any>] => {

  const initRef = useRef(false);
	const [canvasObj, setCanvasObj] = useState<any>(null)

  useEffect(() => {

    // 初始化畫布
    if (!initRef.current) {
			initRef.current = true;
      const canvasObj: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
        width: option.width,
        height: option.height
      });

      setCanvasObj(canvasObj);

      // const rectangle = new fabric.Rect({
      //   left: 50,
      //   top: 50,
      //   width: 100,
      //   height: 100,
      //   fill: 'blue',
      //   selectable: true, // 设置为可选中
      // });

      // rectangle.on('mousedown', (e) => {
      //   console.log(e)
      // });
      // canvasObj.add(rectangle);

    }

  }, []);

  // TODO: 是否把所有 fabric 圖像物件轉成陣列或物件（把cardInfo當作區分其差異的東西）傳出 => 先維持，之後擴充
  // TODO: 綁點擊事件 個別綁嗎 =>  個別綁定，傳事件進去
  // TODO: 先移除排堆資料後 => 補牌 => 算位置 => 動畫（）
  const addRectangle = (param: {action: (id: string) => void}) => {
    const color = ['#ff0000', '#00ff00', '#0000ff'];

    const rec = new fabric.Rect({
      width: Math.floor(Math.random() * 100),
      height: Math.floor(Math.random() * 100),
      top: Math.floor(Math.random() * 300),
      left: Math.floor(Math.random() * 300),
      fill: color[Math.floor(Math.random() * 3)],
      selectable: false, // 设置为可选中
      data: 'hello'
    });

    const rec2 = new fabric.Rect({
      width: Math.floor(Math.random() * 100),
      height: Math.floor(Math.random() * 100),
      top: Math.floor(Math.random() * 300),
      left: Math.floor(Math.random() * 300),
      fill: color[Math.floor(Math.random() * 3)],
      selectable: false, // 设置为可选中
      data: 'hello'
    });


    rec.on('mousedown', (e) => {
      // mouse:down
      if (param.action) {
        param.action('abc')
      }

      // 動畫測試
      rec.animate({
        left: 500,
        top: 500
      }, {
        duration: 1000,
        easing: fabric.util.ease.easeInSine,
        onChange: () => { canvasObj.renderAll()},
        onComplete: () => {}
      }) 

      // rec.setCoords();
      console.log(e)
      
    });
    canvasObj.add(rec);

    // TODO: merge two grapgic into one
    // const merged = new fabric.Group([rec, rec2])

    // merged.on('mousedown', (e) => {
    //   // mouse:down
    //   if (param.action) {
    //     param.action('abc')
    //   }
    //   console.log(e)
    // });
    // canvasObj.add(merged);

  }

  const drawCard = (cardInfo: CardInfo, index: number) => {

    const width = 75
    const height = 120;

    const cardBorder = new fabric.Rect({
      width,
      height,
      top: 5 + Math.floor(index / 6) * (height + 20),
      left: 150 + (index % 6) * ( width + 20),
      stroke: 'red',
      strokeWidth: 5,
      fill: 'rgba(0,0,0,0)',
      selectable: true, // 设置为可选中
    });

    const text = new fabric.Text((cardInfo.amount).toString(), {
      top: 25 + Math.floor(index / 6) * (height + 20),
      left: 175 + (index % 6) * (width + 20),
      fontSize: 24
    })

    // 圖組合併
    const merge = new fabric.Group([cardBorder, text], {
      data: cardInfo
    });
    merge.on('mousedown', (e) => {
      console.log(e)
    });
    canvasObj.add(merge);

  }

  return [
    {
      canvasObj
    }
    , 
    {
      addRectangle,
      drawCard
    }
  ]
}

export default useCanvas;