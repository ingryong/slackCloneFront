import { IChat, IDM } from '@typings/db';
import dayjs from 'dayjs';

/** 채팅 날짜별로 묶어주기 */
export default function makeSection(chatList: (IDM | IChat)[]) {
  const sections: { [key: string]: (IDM | IChat)[] } = {};

  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      // 기존에 묶음이 있는 경우
      sections[monthDate].push(chat);
    } else {
      // 처음 만드는 경우
      sections[monthDate] = [chat];
    }
  });
  return sections;
}
