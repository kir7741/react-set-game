// Enums
import { AmountType } from "../enum/amount-type.enum";
import { CardStatusType } from "../enum/card-status-type.enum";
import { ColorType } from "../enum/color-type.enum";
import { FillType } from "../enum/fill-type.enum";
import { ShapeType } from "../enum/shape-type.enum";

/**
 * 卡片資料介面
 *
 * @export
 * @interface CardInfo
 */
export interface CardInfo {

  /**
   * 數量
   *
   * @type {AmountType}
   * @memberof CardInfo
   */
  amount: AmountType

  /**
   * 顏色
   *
   * @type {ColorType}
   * @memberof CardInfo
   */
  color: ColorType;

  /**
   * 填充方式
   *
   * @type {FillType}
   * @memberof CardInfo
   */
  fill: FillType;

  /**
   * 形狀
   *
   * @type {ShapeType}
   * @memberof CardInfo
   */
  shape: ShapeType;

  /**
   * 卡牌狀態
   *
   * @type {CardStatusType}
   * @memberof CardInfo
   */
  status: CardStatusType;

}