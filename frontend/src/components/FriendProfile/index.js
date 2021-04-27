import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import axios from 'axios';
import Post from '../Post'
import NavBar from '../NavBar'
import SkeletonPost from '../SkeletonPost';
import styles from './FriendProfile.module.css'

const FriendProfile = (props) => {

    const [ posts, setPost ] = useState([])
    const [ user, setUser ] = useState([])

    useEffect(() => {
       axios.get(`http://localhost:3001/api/post/${props.match.params.id}/posts`)
        .then(({ data }) => {
            setPost(data.reverse())
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3001/api/users/${props.match.params.id}`)
         .then(({ data }) => {
             console.log(data)
            setUser(data)
         })
     }, [])

    useEffect(() => {
       document.title = user.name + ' ' +user.lastName + ' | Home' 
    }, [user.lastName, user.name])
 
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
                                            ? user.name +' '+ user.lastName
                                            : <Skeleton  width={170}/>
                                    }
                                </h2>
                                
                               {  user.description ?  user.description : null  }
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
                                <button>add as a friend</button>
                                <button>searchs</button>
                                <button>report</button>
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
                           should be informaiton
                        </p>
                    </div>
                    <div className={styles.photos_container}>
                       {
                           user.friends ? user.friends.length : <Skeleton />
                       }
                    </div>
                </div>
        
                <div className={styles.posts_container}>
                {
                    
                    posts.length < 1  
                        ?<SkeletonPost />
                        : posts.map(post => {
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
                }
                </div>
            </div>
        </div>
    )
}

export default FriendProfile
