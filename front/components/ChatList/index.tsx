import React, { useCallback, useRef, VFC } from 'react';
import Chat from '@components/Chat';
import { IChat, IDM } from '@typings/db';
import { ChatZone, Section } from './styles';
import { Scrollbars } from 'react-custom-scrollbars'

interface Props {
  chatData?: IDM[];
}

/** Chat에서 가져온 채팅을 뿌려줌 */
const ChatList: VFC<Props> = ({chatData}) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(()=>{},[])
  
  return (
    <ChatZone>
      <Section>
        채팅섹션
      </Section>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
      {chatData?.map((chat)=>{
        <Chat key={chat.id} data={chat}/>
      })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
