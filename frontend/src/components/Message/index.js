import Tippy from '@tippyjs/react'
import moment from 'moment'
import styles from './Message.module.css'

const Message = (props) => {

    const { isOwer, text, createdAt } = props

    if(isOwer) {
        return  (
                <div className={styles.msg_container} style={{ justifyContent: 'flex-end' }}>
                    <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='right'>
                        <p style={{background: 'rgb(0, 132, 255)', color: 'white', borderRadius: '1rem 1rem 0rem 1rem'}} className={styles.msg}>{text}</p>
                    </Tippy>
                </div>
        )
    } 

    return (
            <div className={styles.msg_container}>
                <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='left'>
                    <p className={styles.msg}>{text}</p>
                </Tippy>
            </div>       
    )
}

export default Message