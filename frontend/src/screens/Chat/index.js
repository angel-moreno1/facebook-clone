import { useContext, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Skeleton from 'react-loading-skeleton'
import Picker from 'emoji-picker-react';
import 'tippy.js/dist/tippy.css'; 
import MicRecorder from 'mic-recorder-to-mp3'
import { selectUser } from "../../features/userSlice"
import { addNewMessage, loadCurrentChat, loadLatestChats, selectChats } from "../../features/ChatSlice";
import socketContext from '../../components/useSocketContext'
import NavBar from '../../components/NavBar'
import styles from './Chat.module.css'
import Message from "../../components/Message";
import ChatCard from "../../components/ChatCard";
import axios from "axios";

const recorder = new MicRecorder({ bitRate: 128 })
let player;

const Chats = () => {

    const [ openEmojiPicker, setOpenEmojiPicker ] = useState(false);
    const [ message, setMessage ] = useState('');
    const [ currentConversationId, setCurrentConversationId ] = useState(null);
    const [ friend, setFriend] = useState(null);
    const [ blobURL, setBlobURL] = useState(null);

    const user = useSelector(selectUser)
    const { latestMessages, isLoading, hasError, currentChat } = useSelector(selectChats)
    const dispatch = useDispatch()
    const { socket } = useContext(socketContext)

    const chatRef = useRef()

    const recorderAudio = () => {
        recorder.start()
    }

    const stopRecording = () => {
        recorder
            .stop()
            .getMp3().then(([buffer, blob]) => {
                const file = new File(buffer, 'me-at-thevoice.mp3', {
                      type: blob.type,
                      lastModified: Date.now()
                });
                const data = new FormData()
                data.append('file', file)
                axios.post('http://localhost:3001/upload', data).then((r) => {
                    console.log(r)
                })
                const blobURL = URL.createObjectURL(file)
                setBlobURL(blobURL)
            })
    }

    const changedCurrentConversation = id => {
        setCurrentConversationId(id)
    }

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji)
    }

    const sendMessage = event => {
        event.preventDefault()
        if(message) {
            setMessage('')
            socket.emit('messages', ({chatId: currentConversationId, message, friend: friend._id }))  
        }
    }

    useEffect(() => {
        const body = document.querySelector('body')
        document.title = 'Chats'
        body.style.overflowY = 'hidden'
        body.style.background = 'white'

        socket.on('newMessage', message => {
            dispatch(addNewMessage(message))
            console.log(message)
        })
        return () => {
            body.style.overflowY = 'auto'
            body.style.background = '#f4f4f4'
        }
    }, [])
     
    useEffect(() => {
        dispatch(loadLatestChats(user.id))
    }, [user.id, dispatch])

    useEffect(() => {
        if(currentConversationId){
            dispatch(loadCurrentChat(currentConversationId))
        }
    }, [currentConversationId, dispatch])

    useEffect(() => {
        if(currentChat.length >= 1){
            const friend = currentChat.find(message => message.user._id !== user.id)
             setFriend(friend.user)
        }   
        if(chatRef.current){
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [currentChat, user.id])

    return (
        <div className={styles.page}>
            <NavBar />
            <button onClick={recorderAudio}>record</button>
            <button onClick={stopRecording}>stop recording</button>
            {
                blobURL 
                    ? <audio src={blobURL} controls='controls'> </audio>
                    : null
            }
            <div className={styles.container}>
                <aside className={styles.left}>
                    <div>
                        <h2>Chats</h2>
                        <input placeholder='search a friend chat' />
                    </div>
                    {
                        isLoading 
                            ? <h5>Loading chats</h5>
                            : hasError 
                                ? <h5>An error occur while trying to load chats</h5>
                                : latestMessages.length >= 1
                                    ? latestMessages.map(({ chatId, lastMessage }) => {
                                        return <ChatCard
                                                changeCurrent={changedCurrentConversation}
                                                chatId={chatId}
                                                key={chatId}
                                                text={lastMessage.message}
                                                img={lastMessage.user.profile_photo}
                                                name={lastMessage.user.name +' '+lastMessage.user.lastName} 
                                            /> 
                                        })
                                    : <h5>not contacts</h5>
                    }
                </aside>
                <main className={styles.chat_container}>
                    {
                        currentConversationId === null 
                        ? <h1>Need To Select a chat</h1> 
                        : (
                            <>
                            <div className={styles.navbarInfo}>
                        <div className={styles.photo}>
                            { 
                                friend 
                                    ? <img width='100%' height='100%' src={'http://localhost:3001'+friend.profile_photo} alt='user_profile' /> 
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
                            currentChat.map(message => {
                                const isOwer = message.user._id === user.id
                                return <Message 
                                            key={message._id}
                                            isOwer={isOwer}
                                            createdAt={message.createdAt}
                                            text={message.message}
                                        />       
                            })
                        }                                   
                    </div>
                    <div className={styles.send_message}>
                        <form onSubmit={sendMessage}>
                            <input 
                                value={message}
                                disabled={currentConversationId ? false : true}
                                onChange={({ target }) => setMessage(() => target.value)} 
                            />
                             <svg onClick={() => setOpenEmojiPicker(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width='2.5rem' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                            </svg>
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
                    
                </main>
                <aside className={styles.right}>
                    <div>
                        <div className={styles.photo_right}>
                            { 
                                friend 
                                    ? <img width='100%' height='100%' src={'http://localhost:3001'+friend.profile_photo} alt='user_profile' /> 
                                    : <Skeleton width='100%' height='100%' circle={true} /> 
                            }
                        </div>
                        <h2>
                            { 
                                friend 
                                    ? friend.name + ' ' + friend.lastName 
                                    : <Skeleton width={150} /> 
                            }
                        </h2>
                    </div>
                    <div></div>
                </aside>
            </div>
        </div>
    )
}
export default Chats