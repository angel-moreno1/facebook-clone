import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import Comments from '../Comments'
import styles from './Actions.module.css'
import { giveLikeToPost } from '../../features/postSlice'
import translate from '../../i18n/translate'
import covertReactions from '../../utils/convertReactions'
import likeImg from '../../assets/like.png'
import loveImg from '../../assets/love.png'
import amazesImg from '../../assets/amazes.png'
import laughImg from '../../assets/laugh.png'
import sadImg from '../../assets/sad.png'
import angryImg from '../../assets/angry.png'

const Actions = ({ likes, comments, id }) => {

    const [ commentOpen, setCommentOpen ] = useState(false)
    const [ liked, setLiked ] = useState(likes.length)
    const [ likesLocal, setLikesLocal ] = useState(likes)
    const [ likesType, setLikesType  ] = useState(null)
    const [ clicked, setclicked ] = useState(false)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const handleLike = () => {
        setclicked(prev => !prev)
        setLiked(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
        dispatch(giveLikeToPost({ postId: id, type: 'laugh', token: user.token }))
        if(clicked !== true) {
            setLikesLocal([...likesLocal, {type: 'laugh'}])
        }else {
            const newArray = likesLocal
        

            setLikesLocal(likesLocal.filter(like => like.type !== 'laugh'))
        }
  
    }

    useEffect(() => {
        const converted = covertReactions(likesLocal.map(like => like.type))
        setLikesType(converted)
    }, [likes, likesLocal])

    const handleComment = () => {
        setCommentOpen(prev => !prev)
    }

    useEffect(() => {
        if(likes.length){
            likes.forEach(like => {
                if(like.user === user.id){
                    setclicked(true)
                }
            })
        }
    }, [likes, user])

    return (
        <div>
            <div className={styles.post_actions}>
                <div className={styles.reactions_comments}>
                    <span className={styles.reaction_reac_container}>
                    {' '}
                         <span>{liked}</span>
                         { 
                         likesType !== null &&
                         <div className={styles.reaction_img}>
                            {likesType.map(
                               ({ name }) => name === 'like' 
                               ? <img src={likeImg} alt='like' />
                               : name === 'love'
                                    ? <img src={loveImg} alt='love' />
                                    : name === 'laugh'
                                        ? <img src={laughImg} alt='like' />
                                        : name === 'amazes'
                                            ? <img src={amazesImg} alt='amazes' />
                                            : name === 'sad'
                                                ? <img src={sadImg} alt='sad' />
                                                : name === 'angry'
                                                    ? <img src={angryImg} alt='angry' />
                                                    : null
                           )}
                         </div>
                        
                        }
                    </span>
                    <span onClick={handleComment}>{comments.length} { translate('action-comments') }</span>
                </div>
                <div className={styles.actions}>
                    <button className={clicked ? styles.clicked : null} onClick={handleLike}>
                    
                    {
                        liked
                        ? <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }}viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      :<svg xmlns="http://www.w3.org/2000/svg"width='1rem' style={{ marginRight: '0.3rem' }}fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    }
                        { translate('action-like') }
                    </button>
                    <button onClick={handleComment} >
                    <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                        { translate('action-comment') }
                    </button>
                </div>
            </div>
            <div className={styles.commentsContainer}>
                 {
                    commentOpen
                        ? <Comments id={id} shouldLoadComments={comments.length >= 1} commentsLength={comments}/>
                        : null
                }
            </div>
           
        </div>
    )
}

export default Actions