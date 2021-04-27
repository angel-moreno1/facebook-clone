import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { loadUserPosts, selectUser, changeDesc } from '../../features/userSlice'
import Post from '../Post'
import NavBar from '../NavBar'
import CreatePost from '../CreatePost';
import SkeletonPost from '../SkeletonPost';
import styles from './UserProfile.module.css'
import axios from 'axios';

const UserProfile = () => {

    const [ changeDescription, setChangeDescription ] = useState(false)
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const { posts, isLoading, hasError } = useSelector(state => state.user)
    const cachedPosts = posts

    useEffect(() => {
        if(posts.length < 1 || cachedPosts.length !== posts.length ){
            dispatch(loadUserPosts(user.id))
        }   
    }, [dispatch, posts.length])

    useEffect(() => {
       document.title = user.name + ' ' +user.lastName + ' | Home' 
    }, [user.lastName, user.name])

    console.log(user.description)
 
    return (
        <div>
            <NavBar  profile_img={user.profile_photo}/>
            <div className={styles.first}>
                <div className={styles.middle}>
                    <input  type='file' id='cover'/>
                    <label htmlFor='cover' className={styles.cover}>
                        {
                            user.cover_photo
                                ? <img src={'http://localhost:3001'+user.cover_photo} alt='cover_photo' />
                                : <Skeleton width='100%' height='100%' />
                        }
                        
                    </label>
                    <div className={styles.container_info}>
                        <div className={styles.name_desc_container}>
                            <div className={styles.name_desc}>
                            <div className={styles.photo}>
                                {
                                    user.profile_photo
                                        ? <img 
                                            style={{  width: '14rem', height: '14rem', border: '5px solid rgb(201, 199, 199)', borderRadius: '50%' }}
                                            src={'http://localhost:3001'+user.profile_photo}
                                            alt='profile'
                                        />
                                        : <Skeleton width='100%' height='100%' circle={true} />             
                                }
                            </div>
                                <h2 className={styles.name}>
                                    {
                                        user.name
                                            ? user.name + ' ' + user.lastName
                                            : <Skeleton width={170} />
                                    }
                                    
                                </h2>
                                <div className={styles.desc}>
                                    {
                                        user.description 
                                            ? (
                                                <div className={styles.desc}>
                                                    { changeDescription ? null : <span style={{ textAlign: 'center' }}>{user.description}</span> }
                                                    {
                                                        changeDescription 
                                                        ? <ChangeDescription cancel={() => setChangeDescription(false)} />
                                                        : <button onClick={() => setChangeDescription(true)}>Add description</button>
                    
                                                    }
                                                </div>
                                            )
                                            : changeDescription
                                                ? <ChangeDescription cancel={() => setChangeDescription(false)} />
                                                : <button onClick={() => setChangeDescription(true)}>Add description</button>
                                    }
                                </div>
                                
                            </div>
                        </div>
                        <div className={styles.options_information}>
                            
                            <div className={styles.options_first}>
                                <Link to='/account/profile/'>Post</Link>
                                <Link to='/account/information/'>Information</Link>
                                <Link to='/account/friends/'>Friends</Link>
                                <Link to='/account/photos/'>Photos</Link>
                            </div>
                            <div className={styles.options_second}>
                                <button>searchs</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.details_container}>
                <div className={styles.colum}>
                    <div className={styles.details}>
                        <h3>Details</h3>
                        <p>
                            Estudió en <strong>Esc. Sec. Fed. NO. 2 Lic. Alfonso Garcia Robles</strong> <br/>
                            Vive en <strong>Zamora, Michoacan De Ocampo, Mexico </strong><br />
                            De <strong>Zamora, Michoacan De Ocampo, Mexico</strong><br />
                        </p>
                    </div>
                    <div className={styles.photos_container}>
                                {
                                   user ? user.friends.length : <Skeleton />
                                }
                    </div>
                </div>
        
                <div className={styles.posts_container}>
                <CreatePost />
                {
                    isLoading
                        ? <SkeletonPost />
                        : hasError
                            ? <h2>Was an error in server</h2>
                            : posts.length >= 1
                                ? posts.map(post => {
                                    return <Post 
                                    key={post._id}
                                    profile_photo={post.user.profile_photo}
                                    userid={post.user._id}
                                    id={post._id}
                                    lastName={post.user.lastName}
                                    name={post.user.name}
                                    time={post.createdAt}
                                    text={post.text}
                                    comments={post.comments}
                                    likes={post.likes} 
                                    im={post.file ? post.file : null } />
                                })
                                : <h2>Not posts to show</h2>     
                }
                </div>
            </div>
        </div>
    )
}

const ChangeDescription = (props) => {

    const { cancel } = props

    const [ description, setDescription ] = useState('')
    const user = useSelector(selectUser)
    const dispatch = useDispatch()

    const changeDescription = () => {
        if(description) {
            axios.put(`http://localhost:3001/api/users/${user.id}`, { description })
            dispatch(changeDesc(description))
            cancel()
        }
    }

    return (
        <>
        <input 
            value={description} 
            onChange={({ target }) => setDescription(target.value)} 
            className={styles.changeDescription} 
            placeholder='sort description about you' 
        />
        <div style={{ display: 'flex' }}>
            <button onClick={cancel}>cancel</button>
            <button onClick={changeDescription} >updated</button>
        </div>
        </>
    )
}

export default UserProfile
