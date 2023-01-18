import React, { useCallback, useState } from 'react';
import { Header, Form, Label, Input, LinkContainer, Button, Error, Success } from '@pages/SignUp/style';
import useInput from '@hooks/useinput';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSucess] = useState(false);

  /** 비밀번호 입력 */
  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  /** 비밀번호 확인 입력 */
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [[password]],
  );

  /** 회원가입 버튼 클릭시 이벤트 */
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);
      if (!mismatchError && nickname) {
        console.log('서버로 회원가입하기');
        setSignUpError('');
        setSignUpSucess(false);
        axios
          .post('/api/users', { email, nickname, password })
          .then((response) => {
            // 성공시 실행
            console.log(response);
            setSignUpSucess(true);
          })
          .catch((err) => {
            // 실패시 실행
            console.log(err.response);
            setSignUpError(err.response.data);
          })
          .finally(() => {
            // 성공하든 실패하든 공통으로 실행할 것
          });
      }
    },
    [email, nickname, password, passwordCheck],
  );

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label onSubmit={onSubmit}>
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label onSubmit={onSubmit}>
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label onSubmit={onSubmit}>
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label onSubmit={onSubmit}>
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입 되었습니다! 로그인 해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?
        <Link to="/login"> 로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
