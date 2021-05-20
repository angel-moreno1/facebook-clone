import { useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import 'tippy.js/dist/tippy.css'; 
import { selectUser } from "../../features/userSlice"
import { LoadFriendInformation, selectFriend } from "../../features/friendSlice";
import { loadCurrentChat, selectChats, setCurrentConversationId } from "../../features/chatSlice";
import NavBar from '../../components/NavBar'
import FriendInformation from "../../components/FriendInformation";
import LatestChats from "../../components/LatestChats";
import ChatContainer from "../../components/ChatContainer";
import styles from './Chat.module.css'
import translate from "../../i18n/translate";

const Chats = () => {

    const user = useSelector(selectUser)
    const { currentChat, currentConversationId, isLoadingCurrentChat } = useSelector(selectChats)
    const { friendInformation } = useSelector(selectFriend)
    const dispatch = useDispatch()

    const changedCurrentConversation = id => void dispatch(setCurrentConversationId(id))
    
    useEffect(() => { document.title = 'Chats' }, [])

    useEffect(() => { 
        if(currentChat.chatRef) {
            const reference = currentChat.chatRef
            const first = reference.slice(0, reference.length / 2)
            const second = reference.slice(reference.length / 2, reference.length)
            const friend = first === user.id ? second : first
            dispatch(LoadFriendInformation({friendId: friend, token: user.token}))
        }
    }, [currentChat, currentConversationId])

    useEffect(() => {
        if(currentConversationId){
            dispatch(loadCurrentChat({id: currentConversationId, token: user.token}))
        }
    }, [currentConversationId])

    return (
        <div className={styles.page}>
            <NavBar />
            <div className={styles.container}>
                <aside className={styles.left}>
                    <LatestChats friend={friendInformation} changedCurrentConversation={changedCurrentConversation} />
                </aside>
                <main className={styles.chat_container}>
                    {
                        isLoadingCurrentChat 
                        ? <h4 className={styles.loading}>{ translate('loading-chat') }</h4>
                        : currentConversationId === null 
                            ? <h1 className={styles.need_select_chat}>{ translate('select-chat') }</h1> 
                            : <ChatContainer  currentConversationId={currentConversationId} friend={friendInformation} />
                    }
                </main>
                <aside className={styles.right}>
                    {
                        currentConversationId === null 
                        ? <h1 className={styles.need}>{ translate('select-chat') }</h1> 
                        : <FriendInformation friend={friendInformation} />
                    }
                </aside>
            </div>
        </div>
    )
}
export default Chats