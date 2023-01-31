import autosize from 'autosize';
import React, { useCallback, useEffect, useRef, VFC } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from './styles';

interface Props {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 텍스트가 길어지면 자동으로 높이가 늘어남
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  // 엔터 클릭시 submit, 쉬프트+엔터 일 시 보내지 않음
  const onKeyDownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [onSubmitForm],
  );
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeyDownChat}
          placeholder={placeholder}
          ref={textareaRef}
        >
          <textarea value={chat} onChange={onChangeChat} onKeyDown={onKeyDownChat} />
          {/* <Mention
            appendSpaceOnAdd
            trigger="@"
            data={data?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderUserSuggestion}
          /> */}
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
