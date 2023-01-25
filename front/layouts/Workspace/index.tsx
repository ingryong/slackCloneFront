import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState, VFC } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import { toast } from 'react-toastify';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { Button, Input, Label } from '@pages/SignUp/style';
import useInput from '@hooks/useinput';
import Modal from '@components/Modal';
import CreateChannelModal from '@components/CreateChannelModal';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

/** Workspace 레이아웃 */
const Workspace: VFC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const { data: userData, mutate: revalidateUser } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  /** 로그아웃 이벤트 */
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidateUser(false, false);
    });
  }, []);

  /** 상단바 프로필이미지 토글메뉴 버튼 */
  const onClickUserProfile = useCallback(() => {
    console.log('click');
    setShowUserMenu((prev) => !prev);
  }, []);

  /** 프로필이미지 토글메뉴 닫기 */
  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  /** workspace - Addbutton 클릭했을 때 워크스페이스 생성 모달창 열기 */
  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  /** 워크스페이스 생성 모달창 */
  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return; // .trim : 띄어쓰기 포함
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          {
            // API.md의 POST /workspaces
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidateUser();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  /** 워크스페이스 생성 모달창 닫기 */
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  /** 워크스페이스 클릭 토글 */
  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  /** 워크스테이크 토글 - 채널 만들기 */
  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg
              src={gravatar.url(userData.email, { s: '28px', d: 'retro' })}
              alt={userData.nickname}
            ></ProfileImg>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                프로필메뉴
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>워크스페이스 이름</WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>메뉴</h2>
                {/* <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button> */}
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
          </MenuScroll>
          <AddButton>addButton</AddButton>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </div>
  );
};

export default Workspace;
