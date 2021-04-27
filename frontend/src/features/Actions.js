import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import styles from './Actions.module.css'
import Comments from '../components/Comments'
import axios from 'axios'
import { giveLikeToPost } from './postSlice'

const Actions = ({ likes, comments, id }) => {

    const [ commentOpen, setCommentOpen ] = useState(false)
    const [ liked, setLiked ] = useState(likes.length)
    const [ clicked, setclicked ] = useState(false)
    const user = useSelector (selectUser)
    const dispatch = useDispatch()

    const handleLike = () => {
        // userid, postId, type 
        axios.put(`http://localhost:3001/api/post/${id}/like`, { id: user.id, type: 'like' } )
        // dispatch(giveLikeToPost({ userId: user.id, postId: id, type: 'like'  }))
        // console.log({ userId: user.id, postId: id, type: 'like'  })
        setclicked(prev => !prev)
        setLiked(
            prev => prev !== 0 && clicked === false ? prev + 1 : prev === 0 ? prev + 1 : prev -1 
        )
    }

    const handleComment = () => {
        setCommentOpen(prev => !prev)
    }

    useEffect(() => {
        if(likes.length){
            // likes.map(like => console.log(like))
            likes.map(like => like.user === user.id ? setclicked(true) : null )
        }
    }, [likes, user])

    return (
        <div>
            <div className={styles.post_actions}>
                <div className={styles.reactions_comments}>
                    <span >
                    {' '}
                        {liked} reactions
                    </span>
                    <span onClick={handleComment}>{comments.length} comments</span>
                </div>
                <div className={styles.actions}>
                    <button className={clicked ? styles.clicked : null} onClick={handleLike}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='1rem' style={{ marginRight: '0.3rem' }} viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                        Like
                    </button>
                    <button onClick={handleComment} >
                        <svg xmlns="http://www.w3.org/2000/svg"  width='1rem' style={{ marginRight: '0.3rem' }} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                        Comment
                    </button>
                </div>
            </div>
            {
                commentOpen
                    ? <Comments id={id} shouldLoadComments={comments.length >= 1}/>
                    : null
            }
        </div>
    )
}

export default Actions