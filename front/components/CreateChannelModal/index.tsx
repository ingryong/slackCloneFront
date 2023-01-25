import Modal from '@components/Modal';
import useInput from '@hooks/useinput';
import { Button, Input, Label } from '@pages/SignUp/style';
import React, { useCallback, VFC } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel] = useInput('');
  const onCreateChannel = useCallback(() => {}, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>워크스페이스 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
