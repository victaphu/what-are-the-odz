import React, { useContext, useState } from 'react'

import sendIcon from "../../../../images/send.png";
import FileRow from './FileRow'
import ImagesInput from './ImagesInput'
import MessageInput from './MessageInput'
import { useChat } from '@/app/context/ChatContext';
import { useGroups } from '@/app/context/GroupsContext';
import { useAuth } from '@/app/context/AuthContext';
import { Spin } from 'antd';

const NewMessageForm = () => {
  // const { conn, activeChat, sendingMessages, setSendingMessages } = useContext(ChatEngineContext)
  const [state, setState] = useState({
    trigger: 0,
    mod: 3,
    value: '',
    attachments: [] as File[]
  })

  const { postMessage, loading } = useChat();
  const { activeGroup } = useGroups();
  const { user } = useAuth();

  function onRemove(index: number) {
    let { attachments } = state
    attachments.splice(index, 1)
    setState({ ...state, attachments })
  }

  function handleChange(event: { target: { value: any; }; }) {
    setState({
      ...state,
      value: event.target.value,
      trigger: (state.trigger + 1) % state.mod
    });
  }

  function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();

    setState({ ...state, value: '', attachments: [] })

    var textarea = document.getElementById("msg-textarea")
    textarea!.style.height = "24px";

    const text = state.value.trim();
    postMessage(activeGroup, {
      created: new Date().toLocaleString(),
      sender: {
        username: user?.name || user?.evmAddress || 'Frenz',
        avatar: user?.profileImage,
      },
      text,
      sender_username: user?.name || user?.evmAddress || 'Frenz',
    })
  }

  return (
    <div
      id='msg-form-container'
      style={{ ...styles.NewMessageFormContainer, position: 'absolute' }}
      className='ce-message-form-container absolute'
    >
      <FileRow files={state.attachments} onRemove={(i) => onRemove(i)} />
      <form onSubmit={handleSubmit.bind(this)} className='ce-message-form'>
        <div style={styles.inputContainer} className='ce-message-input-form'>
          {/* <ImagesInput onSelectFiles={(attachments) => setState({ ...state, attachments })} /> */}
          <MessageInput
            value={state.value}
            label='Send a message...'
            handleChange={handleChange.bind(this)}
            onSubmit={handleSubmit.bind(this)}
            // disabled={loading}
          />
        </div>
        <button
          type="submit"
          id='ce-send-message-button'
          style={{}}
          disabled={loading}
        >
          {loading ? (
            <Spin size="small" style={{ color: 'white' }} />
          ) : (
            <img src={'/images/send.png'} className="send-icon" alt="" />
          )}
        </button>
      </form>
    </div>
  );
}

export default NewMessageForm

const styles = {
  NewMessageFormContainer: {
    // position: 'absolute', 
    bottom: '0px',
    width: '100%',
    backgroundColor: 'white',
  },
  inputContainer: {
    minHeight: '36px',
    paddingTop: '10px',
    paddingBottom: '6px',
  },
}