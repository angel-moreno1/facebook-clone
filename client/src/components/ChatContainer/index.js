import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MicRecorder from 'mic-recorder-to-mp3'
import Picker from 'emoji-picker-react';
import { selectChats } from "../../features/chatSlice";
import { selectUser } from "../../features/userSlice";
import useUpload from "../../hooks/useUpload";
import socketContext from "../useSocketContext";
import Skeleton from "react-loading-skeleton";
import Message from "../Message";
import styles from './ChatContainer.module.css'
import axios from "axios";

const recorder = new MicRecorder({ bitRate: 128 })

const ChatContainer = props => {

    const { currentConversationId, friend } = props
    const [ openEmojiPicker, setOpenEmojiPicker ] = useState(false);
    const { currentChat } = useSelector(selectChats)
    const [ message, setMessage ] = useState('');
    const [ isRecording, setRecording ] = useState(false);
    const { socket } = useContext(socketContext)
    const user = useSelector(selectUser)
    const chatRef = useRef()
    const [  form, file, onInputChange, setFile ] = useUpload('file')

    const sendMessage = event => {
        event.preventDefault()
        if(file) {
            setFile('')
            axios.post('http://localhost:3001/upload', form)
                .then(({ data }) => {
                    socket.emit(
                        'messages',
                        {chatId: currentConversationId, message: data.location, ref: currentChat.chatRef, isFile: true  }
                    )
                }) 
        }
        if(message) {
            setMessage('')
            socket.emit(
                'messages',
                {chatId: currentConversationId, message, ref: currentChat.chatRef }
            )  
        }
    }
    
    const onEmojiClick = (_, emojiObject) => void setMessage(message + emojiObject.emoji)
    
    const recorderAudio = () => {
        setRecording(true)
        recorder.start()
    }
    
    const stopRecording = () => {
        setRecording(false)
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const file = new File(
                    buffer,
                    `${Date.now()}.mp3`,
                    {
                      type: blob.type,
                      lastModified: Date.now()
                    }
                )
                const data = new FormData()
                data.append('file', file)
                axios.post('http://localhost:3001/upload', data)
                    .then(({ data }) => {
                        socket.emit(
                            'messages',
                            {chatId: currentConversationId, message: data.location, ref: currentChat.chatRef, isFile: true  }
                        )
                    }) 
            })
    }

    useEffect(() => {
        if(chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [currentChat])

    return (
        <>
        <div className={styles.navbarInfo}>
    <div className={styles.photo}>
        { 
            friend 
                ? <img  src={'http://localhost:3001'+friend.profile_photo} alt='user_profile' /> 
                : <Skeleton width='100%' height='100%' circle={true} /> 
        }
    </div>
    <h4>
        { 
            friend ? friend.name + ' '+friend.lastName : <Skeleton width={200} /> 
        }
    </h4>
</div>
<div className={styles.currentChat} ref={chatRef}>
    {
        currentChat
        ? currentChat.messages.map(message => <Message
                        key={message._id}
                        isOwer={message.user._id === user.id}
                        createdAt={message.createdAt}
                        text={message.message}
                        isFile={message.isFile}
                    />   
        )
        : null
    }                                   
</div>
<div className={styles.send_message}>
    <form onSubmit={sendMessage}>
        <input 
            value={message}
            disabled={currentConversationId ? false : true}
            onChange={({ target }) => setMessage(target.value)} 
        />
         <svg onClick={() => setOpenEmojiPicker(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width='2.5rem' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
        </svg>
        {
            !isRecording
            ?  <svg xmlns="http://www.w3.org/2000/svg" onClick={recorderAudio}  viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
               </svg>
            : <svg xmlns="http://www.w3.org/2000/svg" onClick={stopRecording}  viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
        }
       
        <input type='file' id='img' onChange={onInputChange} />
        <label htmlFor='img'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
        </label>
        <input className={styles.submit} type='submit' value='send' />
    </form>
    <div className={styles.picker} onMouseLeave={() => setOpenEmojiPicker(false)} >
        {
            openEmojiPicker ? <Picker onEmojiClick={onEmojiClick} /> : null
        }
    </div>
</div>
        </>
    )
}

export default  ChatContainer