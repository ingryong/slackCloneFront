import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';
import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';

const Workspace: FC = ({ children }) => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  /** 로그아웃 이벤트 */
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname}></ProfileImg>
          </span>
        </RightMenu>
        <button onClick={onLogout}>로그아웃</button>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>워크스페이스</Workspaces>
        <Channels>
          채널
          <WorkspaceName>워크스페이스 이름</WorkspaceName>
          <MenuScroll>메뉴스크롤</MenuScroll>
        </Channels>
        <Chats>챗</Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
