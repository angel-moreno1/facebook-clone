import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Actions from '../../components/Actions'
import { selectUser } from '../../features/userSlice'
import styles from './Post.module.css'
import translate from '../../i18n/translate'

const imageReg = /[\/.](gif|jpg|jpeg|tiff|png|jfif)$/i
const videoReg = /[\/.](webm|mkv|flv|vob|mp4|ogv|ogg|drc|gif|gifv|mov|wmv|amv|m4p|mp2|flv)$/i

const Post = props => {
    
    const { name, time, text, comments, likes, im, id, userid, lastName, profile_photo, felling } = props

    const [ isOwn, setIsOwn ] = useState(null)
    const user = useSelector(selectUser)
    const { language } = useSelector(state => state.lenguage)
    
    useEffect(() => {
        if(userid === user.id) {
            setIsOwn(true)
        } else {
            setIsOwn(false)
        }
    }, [user.id, userid])

    const renderFelling = felling => {
        const isEnglish = language.trim().toLowerCase() === 'en-us'
        switch (felling) {
            case 'bad':
                return isEnglish ? 'bad 🙁' : 'triste 🙁'
            case 'happy':
                return isEnglish ? 'happy 😃' : 'feliz 😃'
            case 'love':
                return  isEnglish ? 'love ❤️' : 'enamorado ❤️'
            case 'angry':
                return isEnglish ? 'angry 😡' : 'enojado 😡'
            default:
                return 'felling or language not supported'
        }
    }

    return (
        <div className={styles.post_card}>
             <div className={styles.meta_container}>
                <div className={styles.meta_info}>
                    <Link  to={`/account/profile/${userid}`}>
                        <img className={styles.meta_img} src={'http://localhost:3001'+profile_photo}  alt='profile_photo' />
                    </Link>
                    <div>
                        <Link className={styles.user_name} to={`/account/profile/${userid}`}>
                            <h4 className={styles.meta_name}>{name} {lastName}</h4>
                        </Link>
                        <time className={styles.meta_time}>{moment(time).calendar()}</time>
                    </div>
                    {
                        true
                        ? <p className={styles.meta_felling} >{translate('felling')} {renderFelling('happy')}</p>
                        : null
                    }
                </div>
                <div>
                    {
                        isOwn !== null 
                            ?  isOwn
                                ?   <svg xmlns="http://www.w3.org/2000/svg" width='1.5rem' color='grey' className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                    </svg>
                                : <p className={styles.meta_report}>{translate('report-post')}</p>
                            : null
                    }
                </div>
            </div>
            <div className={styles.text}>{text}</div>
            {
                im ? imageReg.test(im) 
                        ? <Link to={`/${userid}/photos/${id}`}>
                            <div className={styles.img}>
                                <img src={'http://localhost:3001'+im} alt={'img'}/>
                            </div>
                        </Link> 
                       
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