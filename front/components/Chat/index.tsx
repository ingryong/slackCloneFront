import { IChat, IDM } from '@typings/db';
import React, { memo, VFC } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';

interface Props {
  data: IDM | IChat;
}

const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';

/** 채팅 하나하나 불러오기 */
const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = 'Sender' in data ? data.Sender : data.User;

  // \d는 숫자 / +는 1개 이상 / ?는 0개나 1개 / *은 0개 이상 / g는 모두찾기
  // |는 또는 / \n은 줄바꿈
  const result = regexifyString({
    input: data.content,
    pattern: /@\[(.+?)\]\((\d+?)\)|\n/g,
    decorator(match, index) {
      const arr: string[] | null = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
      if (arr) {
        // 닉네임(arr[1], dmId(arr[2] 탐색))
        return (
          <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
            @{arr[1]}
          </Link>
        );
      }
      return <br key={index} />;
    },
  });

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
