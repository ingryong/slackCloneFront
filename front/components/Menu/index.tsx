import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  style: CSSProperties;
  show: boolean;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}

/** 메뉴 컴포넌트 */
const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  // 부모를 클릭했을 경우 닫히게
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};
export default Menu;
