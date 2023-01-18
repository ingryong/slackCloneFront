import useInput from '@hooks/useinput';
import { Header, Form, Label, Input, LinkContainer, Button, Error } from '@pages/Login/style';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

const Login = () => {
  const { data, error } = useSWR('/api/users', fetcher);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  /** 회원가입 버튼 클릭시 이벤트 */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('/api/users/login', { email, password }, { withCredentials: true })
        .then(() => {
          // 성공시 실행
        })
        .catch((err) => {
          // 실패시 실행
          setLogInError(err.response?.data?.statusCode === 401);
        })
        .finally(() => {
          // 성공하든 실패하든 공통으로 실행할 것
        });
    },
    [email, password],
  );

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
