import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import styles from './Comment.module.css'
import translate from '../../i18n/translate'
import replyImg from '../../assets/icons8-curved-arrow-24.png'
import { memo, useState } from 'react'
import Input from '../Input'
import { Link } from 'react-router-dom'

const Comment = memo(props => {

    const [ reply, setReply ] = useState(false)
    const [ likes, setLikes ] = useState(0)
    const [ clicked, setclicked ] = useState(false)

    const handleLikeComment = () => {
        setclicked(prev => !prev)
        setLikes(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
    }

    const parserCommentTime = time => {
        const timePart =  moment(time).toNow().split(' ')
        const wordTime = timePart[0]
        return timePart.filter(word => word !== wordTime).join(' ')
    }

    return (
        <>
        <div className={styles.container_t}>
            <div className={styles.meta_t}>
                <Link to={`/account/profile/${props.user._id}`}>
                    <img src={'http://localhost:3001'+ props.user.profile_photo} alt='user_img'/>
                </Link>
                <div className={styles.meta_content}>
                <Link className={styles.n} to={`/account/profile/${props.user._id}`}>
                    <h6 className={styles.name}>{ props.user.name } { props.user.lastName }</h6>
                </Link>
                <p className={styles.text}>{ props.text }</p>
                    {
                        true
                        ? <span className={styles.comment_likes}>{likes}</span>
                        : null
                    }
                </div>
            </div>
            
            <div className={styles.capa_two}>
                    <button className={styles.button} onClick={handleLikeComment} >{ translate('action-like') }</button>
                    <button className={styles.button} onClick={() => setReply(prev => !prev)}>{ translate('respond') }</button>
                    <time className={styles.time}>{parserCommentTime(props.createdAt)}</time>
            </div>
            {
                false
                ? <div className={styles.capa_three}>
                    <p><img src={replyImg} alt='reply'/> 3 respuestas</p>
                  </div>
                : null
            }
            {
                reply
                ? <div className={styles.inpu}><Input 
                    respondToName={props.user.name}  
                    respondToId={props.user._id}
                /></div>
                : null
            }
        </div>
            
            {/* <div className={styles.capa_container_e}>
            <div className={styles.images}>
                <img src={'http://localhost:3001'+ props.user.profile_photo} alt='user_img'/>
            </div>
            <div  className={styles.capa_container}>
                <div className={styles.capa_one}>
                    <div className={styles.fdfds}>
                          <h6 className={styles.name}>{ props.user.name } { props.user.lastName }</h6>
                    <p className={styles.text}>{ props.text }</p>
                    {
                        true
                        ? <span className={styles.comment_likes}>{props.likes.length}</span>
                        : null
                    }
                    </div>
                  
                    
                </div>
           
                <div className={styles.capa_two}>
                    <button className={styles.button} onClick={handleLikeComment} >{ translate('action-like') }</button>
                    <button className={styles.button} onClick={() => setReply(prev => !prev)}>{ translate('respond') }</button>
                    <time className={styles.time}>{parserCommentTime(props.createdAt)}</time>
                </div>
            </div>
                {
                    true
                    ? <div className={styles.capa_three}>
                        <p><img src={replyImg} alt='reply'/> 3 respuestas</p>
                     </div>
                    : null
                }
                {
                    reply
                    ? <Input />
                    : null
                }
            </div> */}
        </>
    )
})

export const CommentSkeleton = () => {
    return (
        <div className={styles.container}>
            <div className={styles.images} style={{ marginRight: '0.5rem' }}>
                <Skeleton width={30} height={30} circle/>
            </div>
            <div>
                <div >
                    <h6 className={styles.name}><Skeleton width={100} height={20}/></h6>
                    <p className={styles.text}><Skeleton width={140} height={15}/></p>
                </div>
                <div>
                    <button className={styles.button}><Skeleton width={30}/></button>
                    <button className={styles.button}><Skeleton width={30}/></button>
                    <time className={styles.time}><Skeleton width={30}/></time>
                </div>
            </div>
        </div>
    )
}


export default Comment