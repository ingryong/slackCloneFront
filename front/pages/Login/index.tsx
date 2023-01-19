import useInput from '@hooks/useinput';
import { Header, Form, Label, Input, LinkContainer, Button, Error } from '@pages/SignUp/style';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const Login = () => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 100000, // 주기적으로 호출되지만 dedupingInterval 기간 동안은 캐시에서 불러온다. 캐시 유지기간
  });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  /** 로그인 버튼 클릭시 이벤트 */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then((response) => {
          // 성공시 실행
          mutate(response.data, false); // 데이터를 보내기 전에 미리 UI를 실행해서 딜레이가 없도록 느끼게한다.
        })
        .catch((err) => {
          // 실패시 실행
          setLogInError(err.response?.data?.statusCode === 401);
        })
        .finally(() => {
          // 성공하든 실패하든 공통으로 실행할 것
        });
    },
    [email, password, mutate],
  );

  // 유저 정보를 확인하기 전에 먼저 페이지를 띄워주지 않게
  if (data === undefined) {
    return <div>페이지 로드중</div>;
  }

  // 유저 정보가 성공적으로 수신(get)되면 channel로 이동
  if (!error && data) {
    console.log('로그인', data);
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        {logInError && <Error>아이디와 비밀번호가 일치하지 않습니다.</Error>}
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?
        <Link to="/signup"> 회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Login;
