import Skeleton from 'react-loading-skeleton'
import styles from './ChatCard.module.css'

const ChatCard = (props) => {
    
    const { name, text, img, changeCurrent, chatId } = props

    return (
        <div className={styles.chatCard} onClick={() => changeCurrent(chatId)}>
            <div className={styles.user_photo}>
                {
                    img
                      ? <img width='100%' height='100%' style={{ borderRadius: '100%' }} src={`http://localhost:3001`+img} alt={'friend_photo'}/>
                      : <Skeleton circle={true} width='100%' height='100%'/>
                } 
            </div>
            <div className={styles.info_container}>
                <div className={styles.info}>
                    <h4>
                        {
                            name
                              ? name
                              : <Skeleton />
                        }
                    </h4>
                    <p>
                        {
                            text
                              ? text
                              : <Skeleton />
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatCard