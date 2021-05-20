import Skeleton from 'react-loading-skeleton'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import styles from './ChatCard.module.css'
import translate from '../../i18n/translate'

const ChatCard = props => {

    const { name, text, img, changeCurrent, chatId, isFile } = props

    const user = useSelector(selectUser)
    const isOwn = user.name + ' ' + user.lastName === name

    return (
        <div className={styles.chatCard} onClick={() => changeCurrent(chatId)}>
            <div className={styles.user_photo}>
                {
                    img
                      ? <img width='100%' height='100%' className={styles.img} src={`http://localhost:3001`+img} alt={'friend_photo'}/>
                      : <Skeleton circle={true} width='100%' height='100%'/>
                } 
            </div>
            <div className={styles.info_container}>
                <div className={styles.info}>
                    <h4>
                        {
                            isOwn 
                                ? translate('you')
                                : name
                                    ? name
                                    : <Skeleton />
                        }
                    </h4>
                    {
                        isFile
                            ? <p className={styles.audio}>{ translate('file') }</p>
                            : <p>
                                { 
                                    text
                                        ? text
                                        : <Skeleton />
                                }
                            </p>
                    }
                   
                </div>
            </div>
        </div>
    )
}

export default ChatCard