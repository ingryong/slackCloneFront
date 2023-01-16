import React, { useCallback, useState } from 'react';
import { Header, Form, Label, Input, LinkContainer, Button } from '@pages/SignUp/style';

const SignUp = () => {
  const [email] = useState('');
  const [nickname] = useState('');
  const [password] = useState('');
  const [passwordCheck] = useState('');

  const onChangeEmail = useCallback(() => {}, []);
  const onChangeNickname = useCallback(() => {}, []);
  const onChangePassword = useCallback(() => {}, []);
  const onChangePasswordCheck = useCallback(() => {}, []);

  const onSubmit = useCallback(() => {}, []);

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
          {/* {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>이미 가입된 이메일입니다.</Error>}
          {sighUpSuccess && <Success>회원가입 되었습니다! 로그인</Success>} */}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
