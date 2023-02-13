import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { Container, Header } from '@pages/Channel/styles';
import React, { useCallback } from 'react';
import ChatList from '@components/ChatList';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');

  // 작성된 내용 submit
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log(chat?.trim());
    setChat('');
  }, []);

  return (
    <Container>
      <Header>채널!</Header>
      {/* <ChatList/> */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
