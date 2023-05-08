/**
 * 卡牌填充列舉
 *
 * @export
 * @enum {number}
 */
export enum CardStatusType {

  /**
   * 排堆裡
   */
  DECK = 1,

  /**
   * 牌桌上
   */
  TABLE_BOARD = 2,

  /**
   * 遊玩時，卡片狀態
   */
  PICKED = 3,

  /**
   * 在玩家身上，事後計分
   */
  ON_PLAYER = 4,
  
}
