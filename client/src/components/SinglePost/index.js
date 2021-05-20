
import Tippy from '@tippyjs/react'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import translate from '../../i18n/translate'
import Actions from '../Actions'
import Comment from '../Comment'
import styles from './SinglePost.module.css'

const SinglePost = ({ match }) => {

    const [ postData, setPostData ] = useState({})

    useEffect(() => {
        axios.get(`http://localhost:3001/api/post/${match.params.id}`)
            .then(
                ({ data }) => setPostData(data)
            )
    }, [match.params.id])

    if(Object.keys(postData).length < 1) {
        return <h1>Loading post</h1>
    }
    console.log(postData)
    return (
        <div className={styles.container}>
            <div className={styles.photo_container}>
                <div className={styles.aside_black}>

                </div>
                <div className={styles.img}>
                    <Link to='/'>
                        <div className={styles.close}>X</div>
                    </Link>
                    
                    <img src={'http://localhost:3001'+postData.file} />
                </div>
                <div className={styles.aside_black}>

                </div>
            </div>
            <div className={styles.all}>
                <div className={styles.nav_container}>
                    <div>
                    <Tippy content={translate('messages')} >
                    <Link to='/account/chats' data-tip='messages' >
                        <div className={styles.circle_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" width='5rem' color='rgb(119, 119, 119)' viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
</svg>      
                        </div>
                    </Link>
                </Tippy>
                <Tippy content='notifications'>
                    <Link to='/account/notifications'>
                        <div  className={styles.circle_button}>
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            color='rgb(119, 119, 119)'
                            width='5rem'
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            >
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                    </Link>
                </Tippy>
                    </div>
                </div>
                <div className={styles.m}>
                    <div className={styles.meta_container}>
                        <img src={'http://localhost:3001'+postData.user.profile_photo} /> 
                        <div className={styles.meta_user_info}>
                            <h5 className={styles.meta_user_info_name}>{postData.user.name} {postData.user.lastName}</h5>
                            <span className={styles.meta_user_info_time}>
                                {
                                    moment(postData.createdAt).calendar()
                                }
                            </span>
                        </div>
                        <div className={styles.meta_user_info_option}>
                            ...
                        </div>
                    </div>

                    <div className={styles.content}>
                        {postData.text && <p>{postData.text}</p>}
                       
                    </div>
                    <Actions likes={postData.likes} comments={postData.comments} id={postData._id}/>
                    <div>
                        {postData.comments.map( comment => (
                            <Comment  {...comment} />
                        ))}
                    </div>
                </div>         
            </div>
        </div>
    )
}

export default SinglePost