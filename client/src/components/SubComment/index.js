import { useState } from 'react'
import { Link } from 'react-router-dom'
import translate from '../../i18n/translate'
import parserCommentTime from '../../utils/parserCommentTime'
import Input from '../Input'
import styles from './subComment.module.css'

const SubComment =  props => {

    const {user, text, respondTo, createdAt, like } = props

    const [ reply, setReply ] = useState(false)
    const [ likes, setLikes ] = useState(like.length)
    const [ clicked, setclicked ] = useState(false)

    const handleLikeComment = () => {
        setclicked(prev => !prev)
        setLikes(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
    }

    return (
    <div>
        <div className={styles.meta_t} style={{ textDecoration: 'none' }}>
            <Link className={styles.n} to={`/account/profile/${user._id}`}>
                <img src={'http://localhost:3001'+ user.profile_photo} alt='user_img'/>
            </Link>
            <div className={styles.meta_content}>
                <Link className={styles.n} to={`/account/profile/${user._id}`}>
                    <h6 className={styles.name}>{ user.name } { user.lastName }</h6>
                </Link>
                <p className={styles.text}>
                    <Link className={styles.n} to={`/account/profile/${respondTo._id}`}>
                        <span className={styles.respondTo}>@{respondTo.name} {respondTo.lastName} </span> 
                    </Link>
                    
                    { text }
                </p>
                <span className={styles.comment_likes}>{likes}</span>
            </div>
        </div>
           <div className={styles.capa_two}>
                <button className={styles.button} onClick={handleLikeComment} >{ translate('action-like') }</button>
                <button className={styles.button} onClick={() => setReply(prev => !prev)}>{ translate('respond') }</button>
                 <time className={styles.time}>{parserCommentTime(createdAt)}</time>
            </div>

        {reply && <div className={styles.inpu}>
            <Input 
                respondToName={props.user.name}  
                respondToId={props.user._id}
            />
        </div>}
    </div>
    )
}

export default SubComment
