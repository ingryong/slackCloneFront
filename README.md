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

### SWR

- 데이터를 가져오기 위한 React Hooks 라이브러리
- 캐시로부터 데이터를 반환한 후, fetch 요청을 하고 최종적으로 최신화된 데이터를 가져온다.
- 한 줄의 코드로 프로젝트 내의 데이터 가져오기 로직을 단순화할 수 있다.

#### SWR 의도치 않은 호출 막기

- dedupingInterval : 주기적으로 호출은 되지만 dedupingInterval 기간 내에는 캐시에서 불러온다.

### GRAVATAR

- 랜덤 아바타 이미지 생성

### ract-toastify

- 아래서 위로 메세지를 띄워준 후 사라짐

### autosize

- textArea에서 작성된 텍스트들의 줄이 길어지면 맞춰서 같이 길어지고 짧아진다

### eslint-config-react-app / eslint-plugin-flowtype / eslint-plugin-import / eslint-plugin-jsx-a11y / eslint-plugin-react

- useCallback에서 deps([])를 빼먹었을 때 경고를 나타내준다.
- 완벽하진 않으며 외부에서 끌어와 쓰이는 것들에 대해서는 알려준다.
