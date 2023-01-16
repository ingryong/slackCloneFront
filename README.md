# 리액트 슬랙 클론 프론트엔드 코딩

---

## front 폴더

프론트엔드 개발 코드

### pages

- 서비스 페이지들

### components

- 서비스 페이지를 구성하는 각종 컴포넌트들

### layouts

- 공통되는 레이아웃

---

## 세팅 이후 설치된 라이브러리

### loadable/component

- SPA에서 사이즈가 커지면 로딩 속도나 성능에 문제가 생길 수 있다. 이 때 코드 스플릿을 사용하여 여러개의 번들로 나누거나 동적으로 import 한다.
- React에서 제공하는 React.lazy나 React.suspense도 있지만 SSR까지 커버가 가능하며 사용방법이 거의 동일한 Ladable Component 사용을 페이스북에서도 권장하고 있다.

### @emotion/styled, @emotion/react, @emotion/babel-plugin

- js파일에서 css를 작성할 수 있도록 해준다.
- babel-plugin을 설치하면 압축 / 안쓰는코드 제거 / 소스맵 제공 등이 추가된다.
