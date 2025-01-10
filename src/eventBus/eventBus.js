/**  
Author : 한채영
Description : 이벤트 버스 설정
- 컴포넌트 간 데이터 및 상태 공유
- 즐겨찾기, 변경사항 상태 관리에 사용
*/

import mitt from 'mitt';
export const emitter = mitt();