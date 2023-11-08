import { CardInfo } from '../../interface/card-info.interface';

/**
 * 確認三張牌是否是一組 set
 * 
 * @param cardList - 卡片列表
 * @returns 
 */
export const checkSet = (cardList: CardInfo[]) => {

  if (cardList.length !== 3) {
    return false;
  }

  const colorSet = new Set(cardList.map((card) => card.color));
  const fillSet = new Set(cardList.map((card) => card.fill));
  const shapeSet = new Set(cardList.map((card) => card.shape));
  const amountSet = new Set(cardList.map((card) => card.amount));
  
  return (
    colorSet.size !== 2 &&
    fillSet.size !== 2 &&
    shapeSet.size !== 2 &&
    amountSet.size !== 2
  );

}