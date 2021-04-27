import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Actions from '../../features/Actions'
import { selectUser } from '../../features/userSlice'
import styles from './Post.module.css'

const imageReg = /[\/.](gif|jpg|jpeg|tiff|png|jfif)$/i
const videoReg = /[\/.](webm|mkv|flv|vob|mp4|ogv|ogg|drc|gif|gifv|mov|wmv|amv|m4p|mp2|flv)$/i

const Post = (props) => {

    const { name, time, text, comments, likes, im, id, userid, lastName, profile_photo } = props

    const [ isOwn, setIsOwn ] = useState(null)
    const user = useSelector(selectUser)
    
    useEffect(() => {
        if(userid === user.id) {
            setIsOwn(true)
        } else {
            setIsOwn(false)
        }
    }, [user.id, userid])

    return (
        <div className={styles.post_card}>
            <div className={styles.post_metadata}>
                <div className={styles.img_name}>
                <Link className={styles.user_name} to={`/account/profile/${userid}`}>
                    <img src={'http://localhost:3001'+profile_photo} style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '0.5rem' }} alt='profile_photo' />
                </Link>
                    <div className={styles.user_info}>
                        <div className={styles.user_info_who}>
                           <Link className={styles.user_name} to={`/account/profile/${userid}`}>
                            <h4>{name} {lastName}</h4>
                           </Link>
                        </div>
                        <div>
                            <span>{moment(time).fromNow()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    {
                        isOwn !== null 
                            ?  isOwn
                                ?   <svg xmlns="http://www.w3.org/2000/svg" width='1.5rem' color='grey' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                : <p>report this post</p>
                            : null
                    }
                </div>
               
            </div>
            <div className={styles.text}>{text}</div>
            {
                im ? imageReg.test(im) 
                        ? <div className={styles.img}>
                            <img src={'http://localhost:3001'+im} alt={'img'}/>
                            </div>
                        : videoReg.test(im) 
                            ? <video controls className={styles.img}>
                                <source src={'http://localhost:3001'+im} type="video/mp4"></source>
                            </video>
                            : <h5>Format not allowed</h5>
                    : null

            }
            <Actions likes={likes} id={id}  comments={comments}/>
        </div>
    )
}

export default Post