import Tippy from '@tippyjs/react'
import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import styles from './Message.module.css'

const Message = props => {

    const imageReg = /[\/.](gif|jpg|jpeg|tiff|png|jfif)$/i
    const audioReg = /[\/.](mp3)$/i

    const { isOwer, text, createdAt, isFile } = props

    if(isOwer) {
        if(isFile) {
            if(audioReg.test(text)) {
                return (
                    <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='right'>
                        <div className={styles.audio_container}  style={{ justifyContent: 'flex-end'}}>
                            <audio controls name='media' className={styles.audio} >
                                <source src={text} type="audio/mpeg"  />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </Tippy>
                )
            }else if(imageReg.test(text)) {
                return (
                    <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='right'>
                        <div className={styles.audio_container}  style={{ justifyContent: 'flex-end'}}>
                            <img className={styles.chat_img} src={text} alt='img' />
                        </div>
                    </Tippy>
                )
            }else {
                return (
                    <p>Not allowed</p>
                )
            }
        }
        return  (
                <div className={styles.msg_container} style={{ justifyContent: 'flex-end' }}>
                    <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='right'>
                        {
                            text
                                ? <p style={{background: 'rgb(0, 132, 255)', color: 'white', borderRadius: '1rem 1rem 0rem 1rem'}} className={styles.msg}>{text}</p>
                                : <Skeleton width={Math.floor(Math.random() * (300 - 100 + 1) ) + 100} height={35} style={{ borderRadius: '1rem' }}  />
                        }
                    </Tippy>
                </div>
        )
    }else {
        if(isFile){ 
            if(audioReg.test(text)) {
                    return (
                    <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='left'>
                            <div className={styles.audio_container} >
                                <audio controls name='media' className={styles.audio}>
                                    <source src={text} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                    </Tippy>
                    )
            }
            else if(imageReg.test(text)) {
                return (
                <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='left'>
                    <div className={styles.audio_container} >
                        <img className={styles.chat_img}  src={text} alt='img' />
                    </div>
                </Tippy>

                )
            }else {
                return (
                    <p>Not allowed</p>
                )
            }
        }
        return (
            <div className={styles.msg_container}>
                <Tippy content={moment(createdAt).format('DD-MM-YYYY hh:mm:ss')} placement='left'>
                    {
                        text
                            ? <p className={styles.msg}>{text}</p>
                            : <Skeleton width={Math.floor(Math.random() * (300 - 100 + 1) ) + 100} height={35} style={{ borderRadius: '1rem' }}  />
                        }
                </Tippy>
            </div>       
        )
    }

  
}

export default Message