import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadLatestChats, selectChats } from "../../features/chatSlice"
import { selectUser } from "../../features/userSlice"
import ChatCard from "../ChatCard"
import styles from './LatestChats.module.css'
import translate from '../../i18n/translate'


const LatestChats = props => {

    const { friend, changedCurrentConversation } = props

    const { latestMessages, hasError } = useSelector(selectChats)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    useEffect(() => {
        // if(latestMessages.length < 1) {
            dispatch(loadLatestChats({id: user.id, token: user.token}))
        // }
    }, [])


    return (
        <>
            <div>
                <h2 className={styles.latestMessages}>{translate('latest-messages')}</h2>
            </div>
                {
                    hasError 
                    ? <h5>An error occur while trying to load chats</h5>
                    : latestMessages.length >= 1
                        ? latestMessages.map(({ chatId, lastMessage, friend }) => <ChatCard
                                changeCurrent={changedCurrentConversation}
                                chatId={chatId}
                                key={chatId}
                                text={lastMessage.message}
                                img={lastMessage.user.profile_photo}
                                name={lastMessage.user.name +' '+lastMessage.user.lastName} 
                                friend={friend}
                                isFile={lastMessage.isFile}
                                id={lastMessage.user._id}
                            /> 
                        )
                        : <h5>not contacts</h5>
                }
        </>
    )
}

export default LatestChats