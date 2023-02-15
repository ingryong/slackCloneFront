import React, { useCallback, forwardRef, MutableRefObject, RefObject } from 'react';
import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatSectoins: { [key: string]: (IDM | IChat)[] };
  setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
}

/** Chat에서 가져온 채팅을 뿌려줌 */
const ChatList = forwardRef<Scrollbars, Props>(({ chatSectoins, setSize, isReachingEnd }, scrollRef) => {
  // 채팅 리스트 위로 올릴 때 과거 채팅들 가져올 수 있게
  const onScroll = useCallback(
    (values) => {
      // 가장 위일 때 그리고 불러올 데이터가 있을 때 데이터 추가 로딩
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log('가장 위');
        setSize((prevSize) => prevSize + 1).then(() => {
          // 새로 데이터를 불러오더라도 스크롤 위치 유지
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [scrollRef, isReachingEnd, setSize],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSectoins).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
