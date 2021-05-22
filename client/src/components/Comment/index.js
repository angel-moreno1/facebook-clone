import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import styles from './Comment.module.css'
import translate from '../../i18n/translate'
import replyImg from '../../assets/icons8-curved-arrow-24.png'
import { memo, useEffect, useState } from 'react'
import Input from '../Input'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SubComment from '../SubComment'
import parserCommentTime from '../../utils/parserCommentTime'

const Comment = memo(props => {

    console.log(props)

    const [ reply, setReply ] = useState(false)
    const [ likes, setLikes ] = useState(props.likes.length)
    const [ clicked, setclicked ] = useState(false)
    const [ showReplies, setShowReplies ] = useState(false)
    const [ subComments, setSubComments ] = useState([])

    const handleLikeComment = () => {
        setclicked(prev => !prev)
        setLikes(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
    }

    useEffect(() => {
        if(showReplies === true) {
            axios.get(`http://localhost:3001/api/post/${props._id}/comments`)
                .then(({ data }) => setSubComments(data.subcomments))
        }   
    }, [showReplies])


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
            {props.subcomments.length > 0 && 
                <div className={styles.capa_three}>
                    {
                        showReplies
                        ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {subComments.map(subComment => <SubComment key={subComment._id} like={subComment.likes} createdAt={subComment.createdAt} text={subComment.text} user={subComment.user} respondTo={subComment.respondTo} />)}
                        </div>
                        : <p onClick={() => setShowReplies(true)} ><img src={replyImg} alt='reply'/>see {props.subcomments.length} replies</p>
                    }
                </div>}
            {reply && <div className={styles.inpu}>
                    <Input 
                        respondToName={props.user.name}  
                        respondToId={props.user._id}
                    />
                </div>}
        </div>
        
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