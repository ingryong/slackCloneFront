import { IChat, IDM } from "@typings/db";
import { userInfo } from "os";
import React, { VFC } from "react";
import { ChatWrapper } from "./styles";
import gravatar from 'gravatar'
import { useParams } from "react-router";

interface Props {
    data: IDM | IChat;
  }

  const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
  const Chat: VFC<Props> = ({ data }) => {
    const { workspace } = useParams<{ workspace: string; channel: string }>();
    const user = 'Sender' in data ? data.Sender : data.User;
    
    return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
         <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{data.createdAt}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
}

export default Chat;