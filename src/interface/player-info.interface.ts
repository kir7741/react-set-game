import { CardInfo } from "./card-info.interface";

/**
 *  玩家資料介面
 *
 * @export
 * @interface PlayerInfo
 */
export interface PlayerInfo {

  /**
   * 玩家 id
   *
   * @type {string}
   * @memberof PlayerInfo
   */
  id: string;

  /**
   * 玩家 名稱
   *
   * @type {string}
   * @memberof PlayerInfo
   */
  name: string;

  /**
   * 分數
   *
   * @type {number}
   * @memberof PlayerInfo
   */
  score: number;

  /**
   * 持有牌
   *
   * @type {CardInfo[]}
   * @memberof PlayerInfo
   */
  cards: CardInfo[];

}