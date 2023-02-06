import { IDM } from "@typings/db";
import React, { VFC } from "react";
import { ChatWrapper } from "./styles";
import gravatar from 'gravatar'
import { useParams } from "react-router";

interface Props {
    data: IDM;
  }

  const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';

  /** 채팅 하나하나 불러오기 */
  const Chat: VFC<Props> = ({ data }) => {
    const { workspace } = useParams<{ workspace: string; channel: string }>();
    const user = data.Sender;
    
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
};

export default Chat;