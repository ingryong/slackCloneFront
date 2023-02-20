import ChatBox from '@components/ChatBox';
import useInput from '@hooks/useInput';
import { Container, DragOver, Header } from '@pages/Channel/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatList from '@components/ChatList';
import { useParams } from 'react-router';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite';
import fetcher from '@utils/fetcher';
import makeSection from '@utils/makeSection';
import { IChannel, IChat, IUser } from '@typings/db';
import axios from 'axios';
import useSocket from '@hooks/useSocket';
import Scrollbars from 'react-custom-scrollbars';
import gravatar from 'gravatar';
import InviteChannelModal from '@components/InviteChannelModal';

/** 채널 채팅 */
const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const [socket] = useSocket(workspace);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const [dragOver, setDragOver] = useState(false);

  // 챗 데이터를 모두 가져와 더이상 가져올 데이터가 없을 때
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  // 작성된 내용 submit
  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      // chat이 있을 때 채팅을 등록한다.
      console.log(chat);

      // 옵티미스틱 UI
      // 서버와 통신을 보내기 전에 미리 UI상 보낸 것으로 보이게 하여 사용자에게 지연시간이 없어보이게 한다.
      if (chat?.trim() && chatData && channelData) {
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            UserId: myData.id,
            User: myData,
            ChannelId: channelData.id,
            Channel: channelData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          // 채팅 치면 아래로 내려가게
          scrollbarRef.current?.scrollToBottom();
        });
        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat, chatData, myData, channelData, workspace, channel],
  );

  // 소켓 달아서 DM 보내기
  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData?.id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          // 스크롤을 150 이상 올린 상태에서는 상대방이 채팅 보내도 자동으로 내려가지 않게
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!!', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [channel, myData],
  );

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  // 채널 페이지 접근 시의 시간을 기록함
  useEffect(() => {
    localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
  }, [workspace, channel]);

  // 채널 우측상단 - 채널 초대 이벤트
  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  // 드래그 드랍 이미지 업로드
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      console.log(e);
      const formData = new FormData();
      // 브라우저에 따라 dataTransfer.items 일수도, dataTransfer.files일수도 있다.
      // mdn에 있음
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          console.log(e.dataTransfer.items[i]);
          if (e.dataTransfer.items[i].kind === 'file') {
            const file = e.dataTransfer.items[i].getAsFile();
            console.log(e, '.... file[' + i + '].name = ' + file.name);
            formData.append('image', file);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          console.log(e, '... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
          formData.append('image', e.dataTransfer.files[i]);
        }
      }
      axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
        setDragOver(false);
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
      });
    },
    [workspace, channel],
  );
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    console.log(e);
    setDragOver(true);
  }, []);

  if (!myData || !myData) {
    return null;
  }

  // 날짜별 묶음 적용. 2차원 배열을 flat()을 사용하여 1차원 배열로 바꿈
  const chatSectoins = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>#{channel}</span>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList chatSectoins={chatSectoins} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
      {dragOver && <DragOver>업로드!</DragOver>}
    </Container>
  );
};

export default Channel;
