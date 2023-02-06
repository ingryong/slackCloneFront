import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import { Container, Header } from './styles';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');

  // 등록된 채팅 받아오기
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  // 작성된 내용 submit
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // chat이 있을 때 채팅을 등록한다.
      if (chat?.trim() && chatData) {
        console.log(chat);
        axios
        .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat;
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatData={chatData} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
